import { AppNavigator } from "@/src/navigation/AppNavigator";
import { useColorScheme } from "@/src/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return <AppNavigator colorScheme={colorScheme} />;
}
