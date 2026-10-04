const preferences = [
  {
    label: "Profile visibility",
    sub: "Make profile discoverable by other users",
    defaultOn: true,
  },
  {
    label: "Email notifications",
    sub: "Receive updates on new messages and offers",
    defaultOn: true,
  },
  {
    label: "Request alerts",
    sub: "Notify me when requests match my skills",
    defaultOn: false,
  },
];

export default function PreferencesSection() {
  return (
    <>
      <div className="hidden md:block">
        <PreferencesSectionDesktop />
      </div>

      <div className="md:hidden">
        <PreferencesSectionMobile />
      </div>
    </>
  );
}

function PreferencesSectionDesktop() {
  return <PreferencesFields />;
}

function PreferencesSectionMobile() {
  return <PreferencesFields />;
}

function PreferencesFields() {
  return (
    <div className="space-y-4">
      {preferences.map((preference) => (
        <div
          key={preference.label}
          className="flex items-center justify-between rounded-xl border border-white/6 bg-white/2.5 p-4 transition-colors hover:border-white/9"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-200">
              {preference.label}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {preference.sub}
            </p>
          </div>
          <button
            type="button"
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
              preference.defaultOn ? "bg-[#FF3F3F]" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                preference.defaultOn ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
