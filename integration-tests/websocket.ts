import { WebSocketClient } from '../src';

const wsclient = new WebSocketClient('ws://localhost:26657/websocket');

// New block event
// let count = 0;

// wsclient.subscribe('NewBlock', {}, () => {
//   console.log(count);
//   count += 1;

//   if (count === 3) {
//     wsclient.destroy();
//   }
// });

// MsgSwap
// wsclient.subscribeTx({ 'message.action': '/terra.market.v1beta1.MsgSwap' }, async data => {
//   console.log('Swap occured!');
//   const txInfo = await client.tx.txInfo(data.value.TxResult.txhash);
//   if (txInfo.logs) {
//     console.log(txInfo.logs[0].eventsByType);
//   }
// });

// MsgSend
wsclient.subscribe(
  'Tx',
  {
    'message.action': '/cosmos.bank.v1beta1.MsgSend',
    'message.sender': ['CONTAINS', 'terra1'], // always true
  },
  data => {
    console.log('Send occured!');
    console.log(data.value);
  }
);

wsclient.start();
