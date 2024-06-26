/* eslint-disable no-console */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import minimist from "minimist"
import prompts from "prompts"
import { red, reset } from "kolorist"
import { exec } from "child_process"
import {
  copyDir,
  emptyDir, execCommandExitOnError,
  formatTargetDir,
  isEmpty,
  isValidPackageName,
  pkgFromUserAgent, readFileWithRetries,
  replaceStringInFile,
  runCommand,
  toValidPackageName,
} from "./util"
import { BACKENDS, DATABASES, FRONTENDS } from "./constants"
import type { Database } from "./types"

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ["_"] })
const cwd = process.cwd()

const defaultTargetDir = "hatchify-app"

async function init() {
  const argTargetDir = formatTargetDir(argv._[0])
  const argBackend = (argv.backend || argv.b)?.toUpperCase()
  const argDatabaseUri = argv.database || argv.d
  const argDatabase =
    argDatabaseUri &&
    new URL(argDatabaseUri).protocol.replace(":", "").toUpperCase()
  const argFrontend = (argv.frontend || argv.f || "REACT")?.toUpperCase()
  const argPackagePath = argv.path

  let targetDir = argTargetDir || defaultTargetDir
  const getProjectName = () =>
    targetDir === "." ? path.basename(path.resolve()) : targetDir

  let result: prompts.Answers<
    | "projectName"
    | "overwrite"
    | "packageName"
    | "backend"
    | "database"
    | "databaseHost"
    | "databasePort"
    | "databaseUsername"
    | "databasePassword"
    | "databaseName"
    | "frontend"
  >

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled")
            }
            return null
          },
          name: "overwriteChecker",
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: reset("Package name:"),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || "Invalid package.json name",
        },
        {
          type: BACKENDS[argBackend] ? null : "select",
          name: "backend",
          message:
            argBackend && !BACKENDS[argBackend]
              ? reset(
                  `"${argBackend}" isn't a valid backend. Please choose from below: `,
                )
              : reset("Select a backend:"),
          choices: Object.values(BACKENDS).map((backend) => ({
            title: backend.color(backend.display || backend.name),
            value: backend,
          })),
        },
        {
          type: DATABASES[argDatabase] ? null : "select",
          name: "database",
          message:
            argDatabase && !DATABASES[argDatabase]
              ? reset(
                  `"${argDatabase}" isn't a valid database. Please choose from below: `,
                )
              : reset("Select a database:"),
          choices: Object.values(DATABASES).map((database) => ({
            title: database.color(database.display || database.name),
            value: database,
          })),
        },
        {
          type: (database: Database) =>
            database?.name === "postgres" && !argDatabaseUri ? "text" : null,
          name: "databaseHost",
          message: reset("Database host:"),
          initial: "localhost",
        },
        {
          type: (_, { database }: { database: Database }) =>
            database?.name === "postgres" && !argDatabaseUri ? "number" : null,
          name: "databasePort",
          message: reset("Database port:"),
          initial: 5432,
        },
        {
          type: (_, { database }: { database: Database }) =>
            database?.name === "postgres" && !argDatabaseUri ? "text" : null,
          name: "databaseUsername",
          message: reset("Database username:"),
          initial: "postgres",
        },
        {
          type: (_, { database }: { database: Database }) =>
            database?.name === "postgres" && !argDatabaseUri
              ? "password"
              : null,
          name: "databasePassword",
          message: reset("Database password:"),
          initial: "password",
        },
        {
          type: (_, { database }: { database: Database }) =>
            database?.name === "postgres" && !argDatabaseUri ? "text" : null,
          name: "databaseName",
          message: reset("Database name:"),
          initial: "postgres",
        },
        {
          type: null,
          name: "frontend",
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled")
        },
      },
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  // user choice associated with prompts
  const backend = result.backend || BACKENDS[argBackend]
  const database = result.database || DATABASES[argDatabase]
  const frontend = result.frontend || FRONTENDS[argFrontend]

  const {
    overwrite,
    packageName,
    databaseHost,
    databasePort,
    databaseUsername,
    databasePassword,
    databaseName,
  } = result

  const databaseUri =
    argDatabaseUri ||
    (database?.name === "sqlite"
      ? "sqlite://localhost/:memory"
      : `${database.name}://${encodeURIComponent(
          databaseUsername,
        )}:${encodeURIComponent(databasePassword)}@${encodeURIComponent(
          databaseHost,
        )}:${databasePort}/${encodeURIComponent(databaseName)}`)

  targetDir = packageName || targetDir;

  const root = path.join(cwd, targetDir)

  if (overwrite) {
    await emptyDir(root)
  } else if (!fs.existsSync(root)) {
    await fs.promises.mkdir(root, { recursive: true })
  }

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : "npm"

  console.log(`\nScaffolding project in ${root}...`)

  execCommandExitOnError(`npm create vite@latest "${targetDir}" -- --template react-ts`)

  let templatePackage;
  try {
    templatePackage = JSON.parse(await readFileWithRetries(path.join(root, "package.json")));
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  const backendTemplateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `template-${argBackend ? argBackend.toLowerCase() : backend.name}`,
  )
  const frontendTemplateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    "template-react",
  )

  const [dependencyDetails, devDependencyDetails] = await Promise.all([
    Promise.all(
      [
        "sequelize",
        "@hatchifyjs/core",
        ...backend.dependencies,
        ...database.dependencies,
        ...frontend.dependencies,
      ].map((name) =>
        fetch(`https://registry.npmjs.org/${name}`).then((response) =>
          response.json(),
        ),
      ),
    ),
    Promise.all(
      [
        ...backend.devDependencies,
        ...database.devDependencies,
        ...frontend.devDependencies,
        "nodemon",
        "ts-node",
      ].map((name) =>
        fetch(`https://registry.npmjs.org/${name}`).then((response) =>
          response.json(),
        ),
      ),
    ),
  ])

  const dependencies = dependencyDetails.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]:
        argPackagePath && curr.name.startsWith("@hatchifyjs/")
          ? `${argPackagePath}/${curr.name.replace("@hatchifyjs/", "")}`
          : `^${curr["dist-tags"].latest}`,
    }),
    {},
  )

  const devDependencies = devDependencyDetails.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]:
        argPackagePath && curr.name.startsWith("@hatchifyjs/")
          ? `${argPackagePath}/${curr.name.replace("@hatchifyjs/", "")}`
          : `^${curr["dist-tags"].latest}`,
    }),
    { ...templatePackage.dependencies, ...templatePackage.devDependencies },
  )

  await Promise.all([
    fs.promises.writeFile(
      path.join(root, "nodemon.json"),
      JSON.stringify(
        {
          ext: "ts",
          execMap: { ts: "node --loader ts-node/esm" },
        },
        null,
        2,
      ),
      "utf8",
    ),
    fs.promises.writeFile(
      path.join(root, "package.json"),
      JSON.stringify(
        {
          ...templatePackage,
          name: packageName || getProjectName(),
          type: "module",
          scripts: {
            build: "npm run build:backend && npm run build:frontend",
            "build:backend":
              "tsc --outDir dist/backend --project tsconfig.backend.json",
            "build:frontend": "vite build --outDir dist/frontend",
            dev: "nodemon backend/index.ts --watch backend --watch schemas.ts",
            lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
            "start:backend": "node backend/index.js",
          },
          dependencies: Object.keys(dependencies)
            .sort()
            .reduce(
              (acc, name) => ({ ...acc, [name]: dependencies[name] }),
              {},
            ),
          devDependencies: Object.keys(devDependencies)
            .sort()
            .reduce(
              (acc, name) => ({ ...acc, [name]: devDependencies[name] }),
              {},
            ),
        },
        null,
        2,
      ),
      "utf8",
    ),
    copyDir(path.join(root, "src"), path.join(root, "frontend")),
    replaceStringInFile(path.join(root, "index.html"), "/src", "/frontend"),
    replaceStringInFile(
      path.join(root, "vite.config.ts"),
      "defineConfig({",
      'defineConfig({\n  optimizeDeps: {\n    esbuildOptions: {\n      target: "esnext",\n    },\n  },',
    ),
    fs.promises.writeFile(
      path.join(root, "tsconfig.json"),
      JSON.stringify(
        {
          experimentalResolver: true,
          compilerOptions: {
            module: "NodeNext",
            moduleResolution: "NodeNext",
            target: "ESNext",
            lib: ["DOM", "DOM.Iterable", "ESNext"],
            jsx: "react-jsx",
            composite: true,
            declaration: true,
            incremental: true,
            strict: true,
            allowJs: false,
            allowSyntheticDefaultImports: true,
            downlevelIteration: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            isolatedModules: true,
            noFallthroughCasesInSwitch: true,
            noImplicitReturns: true,
            noUnusedLocals: true,
            resolveJsonModule: true,
            skipLibCheck: true,
            useDefineForClassFields: true,
          },
          include: ["frontend", "backend", "schemas.ts", "vite.config.ts"],
          exclude: ["node_modules"],
        },
        null,
        2,
      ),
      "utf8",
    ),
    fs.promises.rm(path.join(root, "tsconfig.node.json")),
    fs.promises.writeFile(
      path.join(root, "tsconfig.backend.json"),
      JSON.stringify(
        {
          extends: "./tsconfig.json",
          compilerOptions: {},
          include: ["backend", "schemas.ts"],
        },
        null,
        2,
      ),
      "utf8",
    ),
    fs.promises.writeFile(
      path.join(root, ".env"),
      `DB_URI=${databaseUri}`,
      "utf8",
    ),
  ])

  await fs.promises.rm(path.join(root, "src"), { recursive: true, force: true })

  await Promise.all([
    copyDir(backendTemplateDir, root),
    copyDir(frontendTemplateDir, path.join(root, "frontend")),
  ])

  runCommand("npm install", root)

  const cdProjectName = path.relative(cwd, root)
  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
      }`,
    )
  }
  switch (pkgManager) {
    case "yarn":
      console.log("  yarn dev")
      break
    default:
      console.log(`  ${pkgManager} run dev`)
      break
  }

  if (database.name === "postgres" && databaseHost === "localhost") {
    console.log()
    console.log(
      "Make sure you have Postgres running already start a docker container using:",
    )
    console.log(
      `docker run --name hatchify-database -p ${databasePort}:5432 -e POSTGRES_PASSWORD=${databasePassword} -e POSTGRES_USER=${databaseUsername} -d ${databaseName}:alpine`,
    )
  }

  console.log()
}

init().catch((e) => {
  console.error(e)
})
