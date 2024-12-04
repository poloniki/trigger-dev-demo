import { ExampleButton } from "./_components/ExampleButton";
import { logout } from "./login/actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { auth } from "@trigger.dev/sdk/v3";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const triggerToken = await auth.createTriggerPublicToken("sync-example");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Example Sync App
            </h1>
            <form>
              <button
                formAction={logout}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Log out
              </button>
            </form>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 sm:py-12">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col gap-6 items-center text-center">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sync Your Data
                  </h2>
                  <p className="text-sm text-gray-600">
                    Click the button below to sync example data with your
                    account
                  </p>
                </div>
                <ExampleButton token={triggerToken} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
