import { UserObjectHeapAnalytics } from '@/types/heap.types';

export const handleLogoutInHeap = (): void => {
  window.heap?.resetIdentity();
};

export const handleLoginInHeap = async ({
  id,
  email,
  name,
}: UserObjectHeapAnalytics): Promise<void> => {
  window.heap?.identify(id);
  window.heap?.addUserProperties({ email, name });
};

export const identifyUserInHeap = (userId: string): void => {
  window.heap?.identify(userId);
};
