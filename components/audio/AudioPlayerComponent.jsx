// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Audio } from 'expo-av';
// import Slider from '@react-native-community/slider';
// import { Ionicons } from '@expo/vector-icons';

// interface AudioPlayerProps {
//   source: { uri: string } | number; // support cả online và local
// }

// const AudioPlayerComponent: React.FC<AudioPlayerProps> = ({ source }) => {
//   const [sound, setSound] = useState<Audio.Sound | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [position, setPosition] = useState(0);
//   const isSeeking = useRef(false);

//   useEffect(() => {
//     let isMounted = true;

//     const loadSound = async () => {
//       try {
//         const { sound } = await Audio.Sound.createAsync(
//           source,
//           { shouldPlay: false },
//           onPlaybackStatusUpdate
//         );
//         if (isMounted) setSound(sound);
//       } catch (error) {
//         console.error('Failed to load sound', error);
//       }
//     };

//     loadSound();

//     return () => {
//       isMounted = false;
//       sound?.unloadAsync();
//     };
//   }, []);

//   const onPlaybackStatusUpdate = (status: any) => {
//     if (status.isLoaded && !isSeeking.current) {
//       setPosition(status.positionMillis);
//       setDuration(status.durationMillis || 0);
//       setIsPlaying(status.isPlaying);
//     }
//   };

//   const handlePlayPause = async () => {
//     if (!sound) return;
//     const status = await sound.getStatusAsync();
//     if (status.isPlaying) {
//       await sound.pauseAsync();
//     } else {
//       await sound.playAsync();
//     }
//   };

//   const handleSeek = async (value: number) => {
//     if (!sound) return;
//     isSeeking.current = true;
//     await sound.setPositionAsync(value);
//     isSeeking.current = false;
//   };

//   const formatTime = (millis: number) => {
//     const minutes = Math.floor(millis / 60000);
//     const seconds = Math.floor((millis % 60000) / 1000);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={handlePlayPause}>
//         <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="black" />
//       </TouchableOpacity>

//       <Slider
//         style={{ flex: 1, marginHorizontal: 10 }}
//         minimumValue={0}
//         maximumValue={duration}
//         value={position}
//         onSlidingComplete={handleSeek}
//         minimumTrackTintColor="#1FB28A"
//         maximumTrackTintColor="#d3d3d3"
//         thumbTintColor="#1FB28A"
//       />

//       <Text style={styles.timeText}>{formatTime(position)}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F2F2F2',
//     padding: 10,
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   timeText: {
//     width: 50,
//     textAlign: 'right',
//     fontSize: 12,
//     color: '#555',
//   },
// });

// export default AudioPlayerComponent;
