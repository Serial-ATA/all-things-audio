---
title: "Sv7"
summary: "MusePack Stream Version 7 specification"
original: "http://trac.musepack.net/musepack/wiki/SV7Specification"
archive: "https://web.archive.org/web/20230118034057/http://trac.musepack.net/musepack/wiki/SV7Specification"
plaintext: "/plain-texts/formats/musepack/sv7.txt"
---

Adapted from the [original] ([archive])

# Stream Version 7 Format Specification

The data stream is to be seen as a stream of 32 bit words, which is however decoded starting from the MSB. If you regard it as an octet stream, then the order of bits is as follows: (Counting starts from 1, MSB on the left) 

<pre>v-----------------------v-----------------------v-----------------------v-----------------------v-----------------------v---
|25|26|27|28|29|30|31|32|17|18|19|20|21|22|23|24| 9|10|11|12|13|14|15|16| 1| 2| 3| 4| 5| 6| 7| 8|57|58|59|60|61|62|63|64|49|
^-----------------------^-----------------------^-----------------------^-----------------------^-----------------------^---
</pre>

Because of different means of access one has to determine the stream version through another mechanism, because you can access the magic number too late (sic) through this structure. Furthermore, since there are nearly no stream versions below 7 out in the field, and even if they were out there, their quality is suboptimal, only SV7 is described here.

This bit structure mainly causes problems on 16 bit and 64 bit CPUs because one always has to decode with 32 bit words. 

<pre>=============================== BASIC STRUCTURE ============================

Header
~~~~~~

-0-------------------------------------------------------------------------
StreamMinorVersion
 4 bit   0...1           Currently 0 (PNS not used) or 1 (PNS used)

StreamMajorVersion
 4 bit   7               Streamversion 7

Signature
24 bit   0x2B504D        Signature "MP+"
-1------------------------------------------------------------------------
FrameCount
32 bit   0...0xFFFFFFFF  Number of frames, every frame contains 1152
                         samples per channel, the last frame contains 1
                         to 1152 samples per channel. Furthermore, one has to consider
                         the latency of the analysis and the synthesis filterbank of
                         481 samples. See note 2.
-2-------------------------------------------------------------------------
IntensityStereo
 1 bit   0...1           usually 0, when using intensity stereo coding (IS) 1.
                         Not used by any encoder right now.
                         See note 3.

MidSideStereo
 1 bit   0...1           When MidSideStereo is in use, this bit is 1,
                         otherwise 0.

MaxBand
 6 bit   0...32          last subband used in the whole file.
                         Typical values range from 23 to 29.

Profile
 4 bit   0, 7...13       Used profile

                            0: no profile
                            1: Unstable/Experimental
                            2: unused
                            3: unused
                            4: unused
                            5: below Telephone (q= 0.0)
                            6: below Telephone (q= 1.0)
                            7: Telephone       (q= 2.0)
                            8: Thumb           (q= 3.0)
                            9: Radio           (q= 4.0)
                           10: Standard        (q= 5.0)
                           11: Xtreme          (q= 6.0)
                           12: Insane          (q= 7.0)
                           13: BrainDead       (q= 8.0)
                           14: above BrainDead (q= 9.0)
                           15: above BrainDead (q=10.0)

Link
 2 bit                   00: Title starts or ends with a very low level (no live or classical genre titles)
                         01: Title ends loudly
                         10: Title starts loudly
                         11: Titel starts loudly and ends loudly

SampleFreq
 2 bit                   00: 44100 Hz  CD
                         01: 48000 Hz  DAT, DVC, ADR
                         10: 37800 Hz  CD-ROM/XA
                         11: 32000 Hz  DSR, DAT-LP, DVC-LP

MaxLevel
16 bit   0...32768       Maximum level of the coded PCM input signal
                         See note 4.
-3-------------------------------------------------------------------------
TitleGain
16 bit   -32768...+32767 Change in the replay level. Value is treated as
                         signed 16 bit value and the level
                         is changed by that many mB (Millibel). Thus
                         level changes of -327.68 dB to +327.67 dB are possible.
TitlePeak
16 bit   0...65535       Maximum level of the decoded title
                         16422: -6 dB
                         32767:  0 dB
                         65379: +6 dB
-4-------------------------------------------------------------------------
AlbumGain
16 bit   -32768...32767  Change in the replay level if the whole cd is supposed to
                         be played with the same level change for all tracks.
                         Value is treated as signed 16 bit value
                         and the level is attenuated by that many mB (Millibel)
                         Thus, level changes of -327.68 dB to +327.67 dB are possible.
AlbumPeak
16 bit   0...65535       Maximum level of the whole decoded CD
                         16422: -6 dB
                         32767:  0 dB
                         65379: +6 dB
-5-------------------------------------------------------------------------
TrueGapless
 1 bit                   Is True Gapless in use?
                         0: no
                         1: yes

LastFrameLength
11 bit   0, 1...1152     Used Samples of the Last Frame.
                         TrueGapless = 0: always 0
                         TrueGapless = 1: 1...1152

1 bit                    Can fast seeking can be used safely ?
                         0: no
                         1: yes

19 bit                   unused (must be 0)
-6-------------------------------------------------------------------------
EncoderVersion
 8 bit                  Encoder version * 100  (106 = 1.06)
                        EncoderVersion % 10 == 0        Release (1.0)
                        EncoderVersion %  2 == 0        Beta (1.06)
                        EncoderVersion %  2 == 1        Alpha (1.05a...z)
</pre>

## Audio Data (in total FrameCount times)

LengthOfFrame<br />
20 bit

FrameData<br />
? bit<br />
See sv7 frame decoding for more info on the content of audio data 

## End

LastFrameUsedSamples<br />
11 bit (See furthermore note 2)

LengthOfFrame<br />
20 bit

FrameData<br />
? bit

FillBits<br />
The last data word needs to be filled, even if only one bit of it is in use, because this bit is in the last byte of the word in this case.
0...31 bit

## Note 1 (Order of bits)

The bit order can only be decoded on a 16 or 64 bit CPU with difficulties. 

## Note 2 (Effects of the filter bank delay)

448

## Note 3 (Intensity Stereo)

Intensity Stereo, if in use, has to be used from 2.75 upwards. In every frame. In SV4 to 6, one was able to choose between 5.5, 8.25 or 11 kHz, but only for the whole file. Which was unflexible enough. Furthermore, with higher bitrates, there is the possibility that the decoder assumes undefined states, because variables on which the result of decoding heavily depends aren't initialized then. 

## Note 4 (Clipping)

Clipping Prevention right now works in a way that the biggest sample of the PCM input is saved in the mpegplus file and upon replaying one assumes that the peak level is no more than 18% over the level of the PCM input (differences caused by added noise or encoding fluctuations of the level).<br />
This is however a very crude approximation which sometimes attenuates the level too much or not enough.<br />
The exact maximum replay level can only be determined by doing a decode.<br />
Furthermore, note the "FS+>0 dB" problem: There are overdrives of DA converters up to 3 dB possible to be caused by non-clipped samples, if interpolated samples between those samples become too big.

    32000 32000 -32000 -32000

becomes after 2x oversampling:

    32000 45255 32000 0 -32000 -45255 -32000 0

A second problem are level changes on live albums between the tracks, if those have different peak levels. In these cases, the whole album should be attenuated to the required peak level.

<!-- References -->
[original]: http://trac.musepack.net/musepack/wiki/SV7Specification
[archive]: https://web.archive.org/web/20230118034057/http://trac.musepack.net/musepack/wiki/SV7Specification
 
