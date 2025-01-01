import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Notification } from '@/types/supabase'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import { useRouter } from 'expo-router'

interface NotificationItemProps {
  item: Notification
}

export default function NotificationItem({
  item
}: NotificationItemProps) {
  const router = useRouter();

  async function handlePress() {
    const { post_id, comment_id } = JSON.parse(item?.data);
    router.push({ pathname: '/(main)/postDetails', params: { post_id, comment_id }})
  }
  const createdAt = moment(item?.created_at).format("MMM d");
  console.log("notifcation item: " + JSON.stringify(item, null, 2));
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Avatar uri={item?.sender?.image} size={hp(5)} />
      <View style={styles.nameTitle}>
        <Text style={styles.text}>{item?.sender?.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>{item?.title}</Text>
      </View>
      <Text style={[styles.text, { color: theme.colors.textLight }]}>{createdAt}</Text>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: 'continuous'
  },
  nameTitle: {
    flex: 1,
    gap: 2
  },
  text: {
    fontSize: hp(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text
  }
})