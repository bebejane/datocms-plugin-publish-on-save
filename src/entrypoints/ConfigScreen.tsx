import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, SwitchField, Form, Button, Spinner } from 'datocms-react-ui';
import { useState } from 'react';

export type Parameters = {
  autoPublish: boolean;
  disable: boolean;
}

const defaultSettings = {
  autoPublish: false,
  disable: false
} as Parameters

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {

  const parameters = ctx.plugin.attributes.parameters as Parameters;
  const [settings, setSettings] = useState(parameters || defaultSettings)
  const [saving, setSaving] = useState(false)

  const haveChanged = JSON.stringify(parameters) !== JSON.stringify(settings)

  const saveSettings = async () => {
    setSaving(true)
    try {
      await ctx.updatePluginParameters({ ...settings });
      ctx.notice('Saved plugin settings')
    } catch (e) {
      ctx.notice(`Error saving settings: ${(e as Error).message ?? e}`)
    }
    setSaving(false)
  }

  return (
    <Canvas ctx={ctx}>
      <Form onSubmit={saveSettings}>
        <SwitchField
          id={'autoPublish'}
          name={'autoPublish'}
          label={'Alert on save'}
          onChange={(value) => setSettings((prev) => ({ ...prev, autoPublish: value }))}
          value={settings.autoPublish}
        />
        <SwitchField
          id={'disabled'}
          name={'disabled'}
          label={'Disable'}
          onChange={(value) => setSettings((prev) => ({ ...prev, disable: value }))}
          value={settings.disable}
        />
      </Form>
      <br />
      <Button disabled={!haveChanged} onClick={saveSettings} fullWidth={true}>
        {saving ? <Spinner /> : <>Save settings</>}
      </Button>
    </Canvas>
  );
}
