
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MessengerLayout from "./pages/MessengerLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MessengerLayout />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;