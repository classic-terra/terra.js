import { LCDClient } from '../src';

async function main() {
  const client = new LCDClient({
    chainID: 'localterra',
    URL: 'http://localhost:1317',
  });

  console.log(`Proposer: ${JSON.stringify(await client.gov.proposer(1))}`);
  console.log(
    `Initial Deposit:  ${JSON.stringify(await client.gov.initialDeposit(1))}`
  );
  console.log(`Deposits: ${JSON.stringify(await client.gov.deposits(1))}`);
  console.log(`Votes: ${JSON.stringify(await client.gov.votes(1))}`);
}

main().catch(console.error);
