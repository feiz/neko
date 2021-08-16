module.exports = {
  saying: {
    TableName: 'Saying',
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      { AttributeName: 'keyword', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'keyword', KeyType: 'HASH' }
    ]
  },
  word: {
    TableName: 'Word',
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      { AttributeName: 'keyword', AttributeType: 'S' },
      { AttributeName: 'word', AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'keyword', KeyType: 'HASH' },
      { AttributeName: 'word', KeyType: 'RANGE' }
    ]
  }
}
