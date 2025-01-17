import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { SignupView } from '../../../app/signup';

const meta: Meta<typeof SignupView> = {
  title: 'app/signup',
  component: SignupView,
  /** argType: action: '<actionName>' makes calling the function show up in Storybook log */
  argTypes: {
    onSubmit: {
      action: 'onSubmit',
    },
    onNameChange: {
      action: 'onNameChange',
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
    name: "Mock name",
    email: "Mock email",
    password: "Mock password",
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SignupView>;

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
    name: "",
    email: "",
    password: ""
  }
}