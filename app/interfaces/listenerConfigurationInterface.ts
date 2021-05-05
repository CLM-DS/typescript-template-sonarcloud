export interface ListenerConfigurationInterface {
  /**
   * Listener Topic
   */
  topic: string,
  /**
   * onMessage function
   */
   onMessage: (message: unknown) => Promise<void>,
  /**
   * onError function
   */
  onError: (error: unknown) => Promise<void>,
}

//message and error are unknown because the values can be different depending of the interface 
//ServiceBusReceivedMessage, KafkaMessage, ProcessErrorArgs, Error