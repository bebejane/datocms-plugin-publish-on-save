import 'datocms-react-ui/styles.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, IntentCtx, RenderItemFormOutletCtx } from 'datocms-plugin-sdk';
import { render } from './utils/render';
import { ItemType } from 'datocms-plugin-sdk';
import PublishOnSave from './entrypoints/PublishOnSave';
import ConfigScreen from './entrypoints/ConfigScreen';

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  itemFormOutlets(itemType: ItemType, ctx: IntentCtx) {
    return [
      {
        id: 'publishOnSave',
        initialHeight: 0,
      },
    ];
  },
  renderItemFormOutlet(
    outletId,
    ctx: RenderItemFormOutletCtx,
  ) {
    ReactDOM.render(
      <React.StrictMode>
        <PublishOnSave ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  }
});