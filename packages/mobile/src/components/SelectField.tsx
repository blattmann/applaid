import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface Option { label: string; value: string }
interface Props {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  placeholder?: string
}

export function SelectField({ label, value, options, onChange, placeholder = 'Select...' }: Props) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={[styles.triggerText, !selected && styles.placeholder]}>
          {selected ? selected.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={14} color="#6a6865" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.doneBtn}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, item.value === value && styles.optionSelected]}
                  onPress={() => { onChange(item.value); setOpen(false) }}
                >
                  <Text style={[styles.optionText, item.value === value && styles.optionTextSelected]}>
                    {item.label}
                  </Text>
                  {item.value === value && <Ionicons name="checkmark" size={16} color="#c8a96e" />}
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 10, color: '#6a6865', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'SpaceMono', marginBottom: 6 },
  trigger: { backgroundColor: '#1e1e21', borderWidth: 1, borderColor: '#2a2a2e', borderRadius: 6, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  triggerText: { color: '#e8e6e0', fontSize: 14, fontFamily: 'SpaceMono' },
  placeholder: { color: '#6a6865' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#161618', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '60%' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a2e' },
  sheetTitle: { color: '#e8e6e0', fontSize: 14, fontFamily: 'SpaceMono' },
  doneBtn: { color: '#c8a96e', fontSize: 14, fontFamily: 'SpaceMono' },
  option: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2a2a2e', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionSelected: { backgroundColor: '#1e1e21' },
  optionText: { color: '#a09e98', fontSize: 14, fontFamily: 'SpaceMono' },
  optionTextSelected: { color: '#c8a96e' },
})
