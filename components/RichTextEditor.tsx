import { theme } from '@/constants/theme'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor"

interface RichTextEditorProps {
  editorRef: React.MutableRefObject<RichEditor | null>,
  onChange: (body: string) => void,
  setEditorLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * This component renders a rich text editor with custom format.
 * 
 * When the editor is pressed, it doesn't close the keyboard.
 * @requires parent needs to handle keyboard close events.
 */
export default function RichTextEditor({
  editorRef,
  onChange,
  setEditorLoaded
}: RichTextEditorProps) {
  return (
    <TouchableWithoutFeedback >
      <View style={{ minHeight: 285 }}>
        <RichToolbar 
          actions={[
            actions.undo,
            actions.redo,
            actions.setBold,
            actions.setItalic,
            actions.setStrikethrough,
            actions.removeFormat,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.blockquote,
            actions.code,
          ]}
          style={styles.richBar}
          flatContainerStyle={styles.flatStyle}
          selectedIconTint={theme.colors.primaryDark}
          editor={editorRef}
          disabled={false} />
        <RichEditor 
          ref={editorRef}
          containerStyle={styles.rich}
          editorStyle={editorStyle}
          placeholder="What's on your mind?"
          onChange={onChange}
          autoCorrect={false}
          useContainer={true}
          scrollEnabled={false}
          onLoadEnd={() => setEditorLoaded(true)}
          initialFocus={true} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  richBar: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray
  },
  flatStyle: {
    padding: 0,
    gap: 3
  },
  rich: {
    minHeight: 240,
    // height: hp(50), 
    flex: 1,
    overflow: 'scroll',
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    padding: 5
  }
})
const editorStyle = {
  color: theme.colors.textDark,
  placeholderColor: 'gray'
}