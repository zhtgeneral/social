import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { NotificationsView } from '../../../../app/(main)/notifications';

/**
 * @requires image needs to be in the database
 */
const mockUser = {
  name: "Mock user",
  image: "uploads/profiles/1734741351564.png",
  phone: "Mock phone",
  bio: "Mock bio",
  address: "Mock location"
}

const mockSingleNotification = [
  {
    created_at: "2025-01-05 03:45:32.833949+00",
    data: "Mock data",
    id: "Mock id",
    reciever_id: "Mock reciever",
    sender_id: "Mock sender",
    sender: mockUser,
    title: "Mock title",
  }
]
const mockManyNotifications = [
  {
    created_at: "2025-01-05 03:45:32.833949+00",
    data: "Mock data",
    id: "1",
    reciever_id: "Mock reciever",
    sender_id: "Mock sender",
    sender: mockUser,
    title: "Mock title"
  },
  {
    created_at: "2025-01-05 03:45:32.833949+00",
    data: "Mock data",
    id: "2",
    reciever_id: "Mock reciever",
    sender_id: "Mock sender",
    sender: mockUser,
    title: "Mock title"
  },
  {
    created_at: "2025-01-05 03:45:32.833949+00",
    data: "Mock data",
    id: "3",
    reciever_id: "Mock reciever",
    sender_id: "Mock sender",
    sender: mockUser,
    title: "Mock title"
  },
  {
    created_at: "2025-01-05 03:45:32.833949+00",
    data: "Mock data",
    id: "4",
    reciever_id: "Mock reciever",
    sender_id: "Mock sender",
    sender: mockUser,
    title: "Mock title"
  }
]

const meta: Meta<typeof NotificationsView> = {
  title: 'app/(main)/notifications',
  component: NotificationsView,
  args: {
    notifications: []
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 0, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} 

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const SingleNotification: Story = {
  args: {
    notifications: mockSingleNotification
  }
}
export const ManyNotifications: Story = {
  args: {
    notifications: mockManyNotifications
  }
}