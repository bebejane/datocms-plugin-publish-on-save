import { RenderItemFormOutletCtx } from 'datocms-plugin-sdk';
import { useEffect, useState } from 'react';
import { buildClient } from '@datocms/cma-client-browser';
import { Parameters } from './ConfigScreen';

type PropTypes = {
  ctx: RenderItemFormOutletCtx;
};

export default function PublishOnSave({ ctx }: PropTypes) {

  const parameters = ctx.plugin.attributes.parameters as Parameters;
  const draftMode = ctx.itemType.attributes.draft_mode_active
  const { itemStatus, isFormDirty, isSubmitting } = ctx;
  const [wasSubmitting, setWasSubmitting] = useState<boolean | null>(null)

  useEffect(() => {

    if (!ctx.currentUserAccessToken || parameters.disable) return

    const isPublished = itemStatus === 'published'
    const isUpdated = (itemStatus === 'draft' || ctx.itemStatus === 'updated') && !isPublished && wasSubmitting
    const client = buildClient({ apiToken: ctx.currentUserAccessToken as string })

    const reset = () => {
      setWasSubmitting(null)
    }

    const confirm = async () => {

      if (parameters.autoPublish) return true

      return await ctx.openConfirm({
        title: 'Save and publish?',
        content: '',
        cancel: { label: 'Close', value: false },
        choices: [
          { label: 'Yes, publish now', value: true, intent: 'negative' },
        ],
      });
    }

    const publishItem = async () => {
      //@ts-ignore
      if (itemStatus === 'publishing') return

      const confirmed = await confirm()

      if (confirmed) {
        const message = parameters.autoPublish ? 'Auto-Publishing record...' : 'Publishing record...'
        ctx.notice(message)
        try {
          await client.items.publish(ctx.item?.id as string, { recursive: true })
        } catch (e) {
          ctx.notice('Error publishing record')
        }
      }
    }

    if (draftMode && !isPublished && isUpdated) {
      publishItem()
      reset()
    }

  }, [itemStatus, draftMode, isFormDirty, parameters.autoPublish, wasSubmitting])

  useEffect(() => {

    if (!isSubmitting && wasSubmitting === null)
      setWasSubmitting(false)
    else if (isSubmitting && wasSubmitting === false)
      setWasSubmitting(true)

  }, [isSubmitting, wasSubmitting])

  return null
}