import { LCDClient, getContractEvents } from '../src';

const client = new LCDClient({
  chainID: 'localterra',
  URL: 'http://localhost:1317',
});

client.tx
  .txInfo('66F8B52E27B5D6B4CCB7CDF2F10590BF5BFA99D60727E4E17ACB36698CC6AD99')
  .then(txInfo => getContractEvents(txInfo))
  .then(console.log)
  .catch(console.error)
