import { css } from 'pretty-lights';

export const popupSize = css`
  width: 200px;
  height: 140px;
  margin: 0;
  padding: 0;
`;

export const popupClass = css`
  background: white;
`;

export const cwvReport = css`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 200px;
  height: 100px;
`;

export const cwvItem = css`
  color: rgba(0, 0, 0, 0.55);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 20px;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgb(255 255 255 / 40%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
`;

export const cwvItemNoData = css`
  font-style: italic;
  font-weight: normal;
  color: lightgray;
`;

export const goodItem = css`
  background: #34ce6b;
`;

export const impItem = css`
  background: #faa403;
`;

export const badItem = css`
  background: #f84e42;
`;

export const removeAnnotationsBtn = css`
  background: lightgray;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-weight: bold;
  font-size: 12px;
  padding: 5px 10px;
  display: block;
  margin: 10px auto;
  cursor: pointer;
`;
