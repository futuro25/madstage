import useSWR from 'swr'
import React, { useEffect } from 'react';
import LoadingState from "./common/LoadingState";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { config } from '../config';

const MercadoPagoPaymentButton = () => {
  const API_URL = '/api/mercadopago/preferences';

  const { data: mercadoPagoData } = useSWR(API_URL, (url) => fetch(url).then(res => res.json()))
  console.log(mercadoPagoData)

  useEffect(() => {
    initMercadoPago(config.mercadopago.publicKey, { locale: 'es-AR' });
  }, []);

  if (!mercadoPagoData) {
    return <LoadingState />
  }

  if (mercadoPagoData) {
    return (
      <div className='w-[300px] m-2'>
        <Wallet initialization={{preferenceId: mercadoPagoData.id}} />
      </div>
    );
  }
};

export default MercadoPagoPaymentButton;
