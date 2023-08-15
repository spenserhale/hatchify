# $eq

Records that exactly match the given value will be returned. This is case-sensitive.

## Compatibility

This operator is compatible with the following types:
 `string`, `date`, `boolean`,  `number`

## Examples

All examples use this example data:

```json
    "data": [
        {
            "type": "Todo",
            "id": "1",
            "attributes": {
                "name": "Workout",
                "due_date": "2024-12-12T06:00:00.000Z",
                "importance": 6,
                "completed": false
            },
        },
        {
            "type": "Todo",
            "id": "2",
            "attributes": {
                "name": "take out trash",
                "due_date": "2023-05-09T05:00:00.000Z",
                "importance": 9,
                "completed": false
            },
        },
        {
            "type": "Todo",
            "id": "3",
            "attributes": {
                "name": "buy more icecream",
                "due_date": "2023-07-20T05:00:00.000Z",
                "importance": 9,
                "completed": true
            },
        }
    ]
```

The `name` attribute equals "Workout"<br>
`filter[name][$eq]=Workout`<br>

This filter will match the following record:<br>

```json
{
    "type": "Todo",
    "id": "1",
    "attributes": {
        "name": "Workout",
        "due_date": "2024-12-12T06:00:00.000Z",
        "importance": 6,
        "completed": false
    },
},
```

The `importance` attribute equals 9.<br>
`filter[importance][$eq]=9`<br>

This filter will match the following records:<br>

```json
{
    "type": "Todo",
    "id": "2",
    "attributes": {
        "name": "take out trash",
        "due_date": "2023-05-09T05:00:00.000Z",
        "importance": 9,
        "completed": false
    },
},
{
    "type": "Todo",
    "id": "3",
    "attributes": {
        "name": "buy more icecream",
        "due_date": "2023-07-20T05:00:00.000Z",
        "importance": 9,
        "completed": true
    },
}
```