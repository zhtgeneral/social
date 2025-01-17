import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { LoginView } from '../../../app/login';

const meta: Meta<typeof LoginView> = {
  title: 'app/login',
  component: LoginView,
  argTypes: {
    onSubmit: {
      action: 'onSubmit',
    },
    onEmailChange: {
      action: 'onEmailChange',
    },
    onPasswordChange: {
      action: 'onPasswordChange',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state of the form',
    },
  },
  args: {
    email: "Mock email",
    password: "Mock password"
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LoginView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = {
  args: {
    loading: true,
  },
};
export const Empty: Story = {
  args: {
    email: "",
    password: ""
  }
}