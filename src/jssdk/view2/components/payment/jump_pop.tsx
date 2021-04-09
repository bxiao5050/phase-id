import React from 'react';
import {Ins} from '../../index';

export default function JumpPop({url, close}: {url: string; close: () => void}) {
  const i18n = RG.jssdk.config.i18n;
  const open = () => {
    close();
    Ins.hidePayment();
    window.open(url);
  };
  return (
    <div className='win-open'>
      <div className='cover'></div>
      <div className='box rg-center-f'>
        <div className='close' onClick={close}></div>
        <div className='upper'>{i18n.winopen}</div>
        <div className='udder'>
          <div className='btn-jump' onClick={open}>
            {i18n.jump}
          </div>
        </div>
      </div>
    </div>
  );
}
