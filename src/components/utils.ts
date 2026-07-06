import { icons, type IconsOptions } from '@/constants/icon'
import type { Editor } from '@tiptap/vue-3'

/**
 * check limit
 * @param editor editor instance
 * @param maxLength max length
 */
export function checkLimit(editor: Editor, maxLength: number) {
  const textLength = editor.getText().length
  if (maxLength && textLength > maxLength) {
    editor.commands.deleteRange({
      from: maxLength + 1,
      to: textLength + 1,
    })
  }
}

/**
 *
 * @param icon icon name
 * @returns icon path
 */
export function getIcon(icon: keyof IconsOptions | undefined) {
  if (!icon) {
    console.warn(`Icon ${icon} not found`)
    return ''
  }
  return icons[icon]
}
