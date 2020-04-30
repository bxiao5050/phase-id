import * as React from 'react';

type IProps = {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default (props: IProps) => {
  return (
    <input
      type={props.type}
      value={props.value}
      id={props.id}
      placeholder={props.placeholder}
      onChange={e => {
        props.onChange(e);
      }}
      onBlur={e => {
        props.onBlur && props.onBlur(e);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }}
      onFocus={e => {
        props.onFocus && props.onFocus(e);
      }}
    />
  );
};
