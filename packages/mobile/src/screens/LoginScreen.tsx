import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@applaid/core';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading, error } = useAuth();

  const handleSubmit = () => {
    if (isSignUp) {
      signUp(email, password);
    } else {
      signIn(email, password);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>ApplAId</Text>
        <Text style={styles.subtitle}>track the hunt.</Text>
        
        {error && <Text style={styles.error}>{error}</Text>}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6a6865"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6a6865"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0e0e0f" />
          ) : (
            <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={styles.toggleText}>
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0f',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    color: '#c8a96e',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  subtitle: {
    fontSize: 12,
    color: '#6a6865',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 40,
    fontFamily: 'SpaceMono',
  },
  error: {
    color: '#e05a5a',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'SpaceMono',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e1e21',
    borderWidth: 1,
    borderColor: '#2a2a2e',
    color: '#e8e6e0',
    padding: 15,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: 'SpaceMono',
  },
  button: {
    backgroundColor: '#c8a96e',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#0e0e0f',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SpaceMono',
  },
  toggleText: {
    color: '#6a6865',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'SpaceMono',
  },
});
