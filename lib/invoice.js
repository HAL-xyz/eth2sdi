const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const invoice = (merchant, buyer, tx) => {
  const amountWithoutVAT = tx.value / ((100.0 + merchant.VATRate) / 100.0);
  const reference = uuidv4();

  const template = `
    <?xml version="1.0" encoding="UTF-8"?>
    <?xml-stylesheet type="text/xsl" href="xsl/fatturaPA_v1.2.1.xsl"?>
    <p:FatturaElettronica versione="FPR12" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2">
      <FatturaElettronicaHeader>
          <DatiTrasmissione>
            <ProgressivoInvio>0000001</ProgressivoInvio>
            <FormatoTrasmissione>FPR12</FormatoTrasmissione>
            <CodiceDestinatario>${merchant.SDI}</CodiceDestinatario>
          </DatiTrasmissione>
          <CedentePrestatore>
            <DatiAnagrafici>
                <IdFiscaleIVA>
                  <IdPaese>${merchant.country}</IdPaese>
                  <IdCodice>${merchant.taxCode}</IdCodice>
                </IdFiscaleIVA>
                <CodiceFiscale>${merchant.taxCode}</CodiceFiscale>
                <Anagrafica>
                  <Denominazione>${merchant.name}</Denominazione>
                </Anagrafica>
                <RegimeFiscale>RF01</RegimeFiscale>
            </DatiAnagrafici>
            <Sede>
                <Indirizzo>${merchant.address}</Indirizzo>
                <CAP>${merchant.ZIP}</CAP>
                <Comune>${merchant.city}</Comune>
                <Provincia>${merchant.state}</Provincia>
                <Nazione>${merchant.country}</Nazione>
            </Sede>
            <Contatti>
                <Email>${merchant.mail}</Email>
            </Contatti>
          </CedentePrestatore>
          <CessionarioCommittente>
            <DatiAnagrafici>
                <IdFiscaleIVA>
                  <IdPaese>IT</IdPaese>
                  <IdCodice>${buyer.taxCode}</IdCodice>
                </IdFiscaleIVA>
                <CodiceFiscale>${buyer.taxCode}</CodiceFiscale>
                <Anagrafica>
                  <Denominazione>${buyer.name} ${buyer.surname}</Denominazione>
                </Anagrafica>
            </DatiAnagrafici>
            <Sede>
                <Indirizzo></Indirizzo>
                <CAP></CAP>
                <Comune></Comune>
                <Provincia></Provincia>
                <Nazione></Nazione>
            </Sede>
          </CessionarioCommittente>
          <SoggettoEmittente>TZ</SoggettoEmittente>
      </FatturaElettronicaHeader>
      <FatturaElettronicaBody>
          <DatiGenerali>
            <DatiGeneraliDocumento>
                <TipoDocumento>TD01</TipoDocumento>
                <Divisa>EUR</Divisa>
                <Data>${tx.date}</Data>
                <Numero>${reference}</Numero>
                <ImportoTotaleDocumento>${tx.value}</ImportoTotaleDocumento>
                <Causale></Causale>
            </DatiGeneraliDocumento>
            <DatiOrdineAcquisto>
                <IdDocumento></IdDocumento>
            </DatiOrdineAcquisto>
          </DatiGenerali>
          <DatiBeniServizi>
            <DettaglioLinee>
                <NumeroLinea>1</NumeroLinea>
                <Descrizione>Sold item</Descrizione>
                <Quantita>1.00000000</Quantita>
                <PrezzoUnitario>${amountWithoutVAT}</PrezzoUnitario>
                <PrezzoTotale>${amountWithoutVAT}</PrezzoTotale>
                <AliquotaIVA>${merchant.VATRate}</AliquotaIVA>
            </DettaglioLinee>
            <DatiRiepilogo>
                <AliquotaIVA>${merchant.VATRate}</AliquotaIVA>
                <ImponibileImporto>${amountWithoutVAT}</ImponibileImporto>
                <Imposta>${tx.value - amountWithoutVAT}</Imposta>
                <EsigibilitaIVA>I</EsigibilitaIVA>
            </DatiRiepilogo>
          </DatiBeniServizi>
          <DatiPagamento>
            <CondizioniPagamento>TP02</CondizioniPagamento>
            <DettaglioPagamento>
                <ModalitaPagamento>MP01</ModalitaPagamento>
                <DataScadenzaPagamento>${tx.date}</DataScadenzaPagamento>
                <ImportoPagamento>${tx.value}</ImportoPagamento>
                <IBAN></IBAN>
            </DettaglioPagamento>
          </DatiPagamento>
      </FatturaElettronicaBody>
    </p:FatturaElettronica>
  `;

  fs.writeFile(`./invoices/${merchant.country}${merchant.taxCode}_${reference}.xml`, template, (err) => {
    if (err) return console.log(err);
    console.log('Print file');
  });
};

module.exports = { invoice };
