import { createConsumer } from '../utils/broker/consumer';
import { createProducer } from '../utils/broker/producer';

interface brokerInterface {
  /**
   * Check function
   */
  check: () => Promise<boolean>,
  /**
   * Producer
   */
  producer: ReturnType<typeof createProducer>,
  /**
   * Consumer
   */
  consumer: ReturnType<typeof createConsumer>,
  /**
   * Set Error Function
   */
  setError: (error: string | boolean) => void,
  /**
   * Have Error Function
   */
  haveError: () => string | boolean,
}

export { brokerInterface };