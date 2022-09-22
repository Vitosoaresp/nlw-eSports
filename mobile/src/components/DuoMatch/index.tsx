import { useState } from 'react';
import { View, Alert, Modal, ModalProps, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CheckCircle } from 'phosphor-react-native';
import * as Clipboad from 'expo-clipboard';

import { styles } from './styles';
import { THEME } from '../../theme';
import { Heading } from '../Heading';

interface Props extends ModalProps {
  discord: string;
  onClose: () => void;
}

export function DuoMatch({ onClose, discord, ...rest} : Props) {
  const [isCopping, setIsCopping] = useState(false);

  async function handleCopyDiscordToClipboard() {
  setIsCopping(true)
  await Clipboad.setStringAsync(discord);

  Alert.alert('Discord Cópiado', 'Usúario copiado para colar no Discord!');
  setIsCopping(false)
  }

  return (
    <Modal
      animationType='fade'
      {...rest}
      transparent
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={20}
              color={THEME.COLORS.CAPTION_500}
            />
          </TouchableOpacity>

          <CheckCircle
            size={64}
            color={THEME.COLORS.SUCCESS}
            weight="bold"
          />

          <Heading
            style={{ alignItems: 'center', marginTop: 24 }}
            title="Let`s Play!"
            subtitle='Agora é só começas a jogar!'
          />

          
          <Text style={styles.label}>
            Adicione no Discord
          </Text>
          <TouchableOpacity
            onPress={handleCopyDiscordToClipboard}
            style={styles.discordButton}
            disabled={isCopping}
          >
            <Text style={styles.discord}> 
              {isCopping ? <ActivityIndicator color={THEME.COLORS.PRIMARY} /> : discord}
            </Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
}