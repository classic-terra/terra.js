import { Fee, MsgSend } from '../src';
import { LocalTerra } from '../src';
import { CLIKey } from '../src/key/CLIKey';

const client = new LocalTerra();
const { test1 } = client.wallets;
const cliKey = new CLIKey({ keyName: 'operator' });

const cliWallet = client.wallet(cliKey);

const send = new MsgSend(cliWallet.key.accAddress, test1.key.accAddress, {
  uluna: 100000,
});

async function main() {
  const tx = await cliWallet.createAndSignTx({
    msgs: [send],
    fee: new Fee(200000, { uluna: 1000 }, '', ''),
  });

  console.log(await client.tx.broadcast(tx));
}

main().catch(console.error);
