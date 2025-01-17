import React from 'react';
import { View } from 'react-native';
import type { StoryObj } from '@storybook/react';
import Welcome from '../../../app/welcome';

const meta = {
  title: 'app/welcome',
  component: Welcome,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} 

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};