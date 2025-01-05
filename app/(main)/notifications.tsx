import Header from '@/components/Header';
import NotificationItem from '@/components/NotificationItem';
import ScreenWrapper from '@/components/ScreenWrapper';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { hp, wp } from '@/helpers/common';
import { fetchNotificationsForUser } from '@/services/notificationService';
import { Notification } from '@/types/supabase';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

const increase = 3;
const numNotifications = increase;

interface NotificationsViewProps {
  notifications: Notification[]
}

/**
 * This component handles `/notificiations`.
 * 
 * This component acts as a controller by passing params into the view model.
 * 
 * This improves the testability of the view component.
 */
export default function _NotificationsController() {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    getNotificiations();
  }, [])

  async function getNotificiations() {
    const response = await fetchNotificationsForUser(numNotifications, user?.id);
    if (response.success) {
      setNotifications(response.data);
    } else {
      Alert.alert("Notifications error", response.message);
    }
  }

  return <NotificationsView notifications={notifications} />;
}

/**
 * It displays all the notifications.
 * 
 * If there are no notifications, it displays "Nothing to catch up on."
 * 
 * @testing pass in objects for notifications.
 */
function NotificationsView({
  notifications
}: NotificationsViewProps) {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title="Notifications" />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listStyle}>
          {
            notifications.map((n: Notification) => (
              <NotificationItem 
                key={n.id}
                item={n} />
            ))
          }
          {
            notifications.length === 0 && (
              <Text style={styles.noData}>Nothing to catch up on.</Text>
            )
          }
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4)
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10
  },
  noData: {
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: 'center'
  }
})