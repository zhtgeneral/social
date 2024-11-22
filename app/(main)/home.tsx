import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import { supabase } from '@/lib/Supabase'
import React from 'react'
import { Alert, StyleSheet, Text } from 'react-native'

/**
 * This page handles `/home`.
 * 
 * @requires user needs to be logged in to get here.
 * 
 * @TODO
 */
const Home = () => {
  async function onLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout error", error.message);
    }
  }
  return (
    <ScreenWrapper>
      <Text>
        Home
      </Text>
      <Button title="logout" onPress={onLogout}/>
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({})