export function generateGuid() {
  return crypto.randomUUID().toString().replaceAll('-', '');
}