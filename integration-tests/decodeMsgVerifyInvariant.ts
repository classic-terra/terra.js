import { LCDClient } from '../src';

async function main() {
  const client = new LCDClient({
    chainID: 'localterra',
    URL: 'http://localhost:1317',
    isClassic: !!process.env.TERRA_IS_CLASSIC,
  });

  (await client.tx.txInfosByHeight(1538)).
    map((tx) => {
      console.log(JSON.stringify(tx));
    });
}

main().catch(console.error);
