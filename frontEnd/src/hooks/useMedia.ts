import { useEffect, useState } from 'react';
import useSpeaker from '@/stores/useSpeaker';
import useMediaControl from '@/stores/useMediaControl';
import useRoomConfigData from '@/stores/useRoomConfigData';

export interface MediaObject {
  stream: MediaStream | undefined;
  camera: {
    list: MediaDeviceInfo[] | undefined;
    setCamera: React.Dispatch<React.SetStateAction<string>>;
  };
  mic: {
    list: MediaDeviceInfo[] | undefined;
    setMic: React.Dispatch<React.SetStateAction<string>>;
  };
  speaker: {
    list: MediaDeviceInfo[] | undefined;
  };
}

export default function useMedia(): MediaObject {
  const [userStream, setUserStream] = useState<MediaStream>();
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>();
  const [micList, setMicList] = useState<MediaDeviceInfo[]>();
  const [speakerList, setSpeakerList] = useState<MediaDeviceInfo[]>();
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMic, setSelectedMic] = useState<string>('');
  const { speaker } = useSpeaker((state) => state);
  const { micOn, videoOn } = useMediaControl((state) => state);
  const { revokeMediaPermission } = useRoomConfigData((state) => state.actions);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true,
        audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
      })
      .then((stream) => {
        navigator.mediaDevices.enumerateDevices().then((res) => {
          setCameraList(res.filter((mediaDevice) => mediaDevice.kind === 'videoinput'));
          setMicList(res.filter((mediaDevice) => mediaDevice.kind === 'audioinput'));
          setSpeakerList(res.filter((mediaDevice) => mediaDevice.kind === 'audiooutput'));
        });

        if (!micOn)
          stream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });

        if (!videoOn)
          stream.getVideoTracks().forEach((track) => {
            track.enabled = false;
          });
        setUserStream(stream);
      })
      .catch(revokeMediaPermission);
  }, [selectedCamera, selectedMic, speaker]);

  return {
    stream: userStream,
    camera: { list: cameraList, setCamera: setSelectedCamera },
    mic: { list: micList, setMic: setSelectedMic },
    speaker: { list: speakerList },
  };
}
