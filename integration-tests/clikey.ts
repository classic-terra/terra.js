import { MsgSend } from '../src';
import { LocalTerra } from '../src';
import { CLIKey } from '../src/key/CLIKey';

const client = new LocalTerra(!!process.env.TERRA_IS_CLASSIC);
const { test1 } = client.wallets;
const cliKey = new CLIKey({ keyName: 'test0' });

const cliWallet = client.wallet(cliKey);

const send = new MsgSend(cliWallet.key.accAddress, test1.key.accAddress, {
  uluna: 100000,
});

async function main() {
  const tx = await cliWallet.createAndSignTx({
    msgs: [send],
  });

  console.log(await client.tx.broadcast(tx));
}

main().catch(console.error);
