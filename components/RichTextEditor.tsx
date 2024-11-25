import { theme } from '@/constants/theme'
import React, { FC, MutableRefObject, useEffect } from 'react'
import { Keyboard, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor"


interface RichTextEditorProps {
  editorRef: MutableRefObject<RichEditor | null>,
  onChange: (body: string) => void
}

const RichTextEditor: FC<RichTextEditorProps> = ({
  editorRef,
  onChange
}) => {
  return (
    <Pressable>
      <View style={{ minHeight: 285 }}>
        <RichToolbar 
          actions={[
            actions.setStrikethrough,
            actions.removeFormat,
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.blockquote,
            actions.code,
            actions.line
          ]}
          style={styles.richBar}
          flatContainerStyle={styles.flatStyle}
          selectedIconTint={theme.colors.primaryDark}
          editor={editorRef}
          disabled={false}
        />
        <RichEditor 
          ref={editorRef}
          containerStyle={styles.rich}
          editorStyle={editorStyle}
          placeholder="What's on your mind?"
          onChange={onChange}
          autoCorrect={false}
          useContainer={true}
          scrollEnabled={false}
          initialFocus={true}
        />
      </View>
    </Pressable>
  )
}

export default RichTextEditor

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