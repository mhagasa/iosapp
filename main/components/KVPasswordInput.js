import React, {useState} from 'react';
import {StyleSheet, Pressable, TextInput, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default KVPasswordInput = ({onValueChange, placeholder}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleValueChanged = value => {
    onValueChange(value);
    setPassword(value);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputField}
        name="password"
        placeholder={placeholder}
        value={password}
        secureTextEntry={showPassword}
        onChangeText={value => {
          handleValueChanged(value);
        }}
      />
      <Pressable onPress={handlePasswordVisibility} style={styles.icon}>
        {showPassword ? (
          <Ionicons name="eye-off" size={20} />
        ) : (
          <Ionicons name="eye" size={20} />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingTop: 10,
    fontSize: 16,
    minHeight: 40,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  inputField: {
    width: '80%',
  },
  icon: {
    marginTop: 12,
    marginRight: 0,
  },
});
