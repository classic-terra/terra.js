import { LCDClient, MsgSend, MnemonicKey } from '../src';

async function main() {
	// create a key out of a mnemonic
	const mk = new MnemonicKey({
		mnemonic:
			'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
	});

	const client = new LCDClient({
		chainID: 'localterra',
		URL: 'http://localhost:1317',
	});

	const wallet = client.wallet(mk);

	// create a simple message that moves coin balances
	const send = new MsgSend(
		'terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v',
		'terra17lmam6zguazs5q5u6z5mmx76uj63gldnse2pdp',
		{ uluna: 1312029 }
	);

	const tx = await wallet
		.createTx({
			msgs: [send],
			memo: 'test from terra.js!',
		});

	const result = await client.tx.estimateGas(tx, {
		signers: [
			{
				sequenceNumber: await wallet.sequence(),
				publicKey: wallet.key.publicKey,
			},
		]
	});
	console.log('Gas', result);
}

main().catch(console.error);
