import { useEffect, useRef } from 'react'
interface JitsiRoomProps {
  roomName: string
  displayName: string
  isModerator?: boolean
  onReady?: () => void
}
export default function JitsiRoom({ roomName, displayName, isModerator, onReady }: JitsiRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    let api: { dispose: () => void; addEventListener: (event: string, cb: () => void) => void } | null = null
    script.onload = () => {
      // @ts-expect-error JitsiMeetExternalAPI loaded globally
      api = new JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: container,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: !isModerator,
          startWithVideoMuted: !isModerator,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false,
          TOOLBAR_BUTTONS: isModerator
            ? [
                'microphone', 'camera', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'chat', 'raisehand',
                'videoquality', 'filmstrip', 'tileview', 'mute-everyone',
              ]
            : [
                'microphone', 'camera', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'chat', 'raisehand',
                'videoquality', 'filmstrip', 'tileview',
              ],
        },
        userInfo: { displayName },
      })
      api.addEventListener('videoConferenceJoined', () => onReady?.())
    }
    document.body.appendChild(script)
    return () => {
      api?.dispose()
      script.remove()
      container.innerHTML = ''
    }
  }, [roomName, displayName, isModerator, onReady])
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-black rounded-xl overflow-hidden border border-white/5">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}