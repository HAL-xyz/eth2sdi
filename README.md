# eth2sdi - An Ethereum cash register for Italian SMEs
[![ETH Turin 2020](https://img.shields.io/badge/%CE%9E-ETH%20Turin%202020-F64060.svg)](https://ethturin.com)

A tool to enable Italian SMEs, local businesses and communities to **receive payments on Ethereum and automatically make invoices compliant with the XML-SDI Italian mandatory format** (Italian companies need to send these "SDI" XMLs files to the Tax Authority. Paper invoices are no longer valid).

[HAL](https://www.hal.xyz/) team joined the "Micro Defi and Circular Economy" [main track at ETHTurin](https://ethturin.com/main-track-details) ("the possibility of operating traditional DeFi with a direct link on token sales and currency-staking to local businesses, venues, and communities").
Since we want Ethereum to be easily used my a large audience of local Italian SMEs, we decided to build a PoC to help them automatically fulfill the Italian laws and tax compliant rules. Compliance with local laws is fundamental!

*Note1: this is just a PoC built for an hackhaton! Please talk to your tax consultant before using it!*

*Note2: please also read our [Gluing Manifesto](https://medium.com/coinmonks/the-gluing-manifesto-159cabef0532) to know more about our vision*

## How it works

In this PoC we leverage the latest ENS feature aka [Text Records support](https://medium.com/the-ethereum-name-service/new-text-records-now-available-for-ens-names-in-manager-a0ebb9cda73a) to let the Customer self assess its own tax data. 

For the sake of the demonstration we use DAI, it could be easily extended to ETH and other tokens. 

We use HAL.xyz to look for payment confirmation on chain and a simple Node.js backend to generate the invoice.

The customers are required to have an ENS to proceed.

There are 3 phases:
1. Merchant setup
2. Customer setup
3. Buy from Merchant

### Merchant Setup

1) You clone this repo and setup your business' global variables in the const/merchant.js file
2) You setup this script on your server (or on a serverless environment). Requirement: the script needs to be reachable by a webhook (HTTP Post requests). Please also check that the *invoices* folder has writing permission enabled (we will save there the invoices!)
3) You open your HAL.xyz account and create a "Watch an event" trigger
4) [IF] You insert the 0x6b175474e89094c44da98b954eedeac495271d0f address (DAI). You watch the *Transfer* event and you put in the *dst* variable your Ethereum address
5) [THEN] You select webhook and insert the URL of where you uploded your script (e.g. https://mydomain.com/hook). Click "Create" and you're done!

### Customer Setup

1) If you don't have, [register](https://app.ens.domains/) an ENS name like `myname.eth` associating to the wallet you are going to send the payment
2) Set-up also the reverse resolution, so the Merchant could associate your Ethereum address to your ENS Name
3) Store your personal info as a Text Record using the key `Description` e.g.
```
{
  name: 'Bobby',
  surname: 'Arturo',
  taxCode: 'XXXXXXXXXXXX',
  email: 'ba@myemail.xyz'
}
```

### Let's buy (and sell)!

1) As a Customer... send an amount of DAI to the address of the Merchant
2) When the transaction is confirmed, HAL.xyz sends the data to our script. The script creates the invoice in the XML-SDI format and save it in the *invoices* folder. The invoice reference is created randomly (e.g. "a86a5da2d"). So if your business tax code is "08899321321", you will find a "IT08899321321_a86a5da2d.xml" file
3) Dear SME, you're tax compliant and ready to sell... just focus on bringing your business on Ethereum and increase your revenues! ;)
