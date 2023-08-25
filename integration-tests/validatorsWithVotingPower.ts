import { LCDClient } from '../src';

const client = new LCDClient({
  chainID: 'localterra',
  URL: 'http://localhost:1317',
});

client.utils.validatorsWithVotingPower().then(x => console.log(x));
