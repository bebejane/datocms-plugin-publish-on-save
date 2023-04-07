import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, SwitchField, Form, Button, Spinner } from 'datocms-react-ui';
import { useState } from 'react';

const defaultSettings = {
  alertOnSave: true
} as Parameters

export type Parameters = {
  alertOnSave: boolean;
}

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  const parameters = ctx.plugin.attributes.parameters as Parameters;
  const [settings, setSettings] = useState(parameters || defaultSettings)
  const [saving, setSaving] = useState(false)

  const saveSettings = async () => {
    setSaving(true)
    try {
      await ctx.updatePluginParameters({ ...settings });
      ctx.notice('Saved plugin settings')
    } catch (e) {
      ctx.notice('Error saving settings')
    }
    setSaving(false)
  }

  const haveChanged = JSON.stringify(parameters) !== JSON.stringify(settings)
  return (
    <Canvas ctx={ctx}>
      <Form onSubmit={saveSettings}>
        <SwitchField
          id={'alertOnSave'}
          name={'alertOnSave'}
          label={'Alert on save'}
          onChange={(value) => setSettings((prev) => ({ ...prev, alertOnSave: value }))}
          value={settings.alertOnSave}
        />
      </Form>
      <br />
      <Button disabled={!haveChanged} onClick={saveSettings} fullWidth={true}>
        {saving ? <Spinner /> : <>Save settings</>}
      </Button>
    </Canvas>
  );
}
