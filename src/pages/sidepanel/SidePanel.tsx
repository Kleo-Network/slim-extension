import { FormEvent, ReactElement, useEffect, useState } from 'react';

type TabKey = 'tasks' | 'wallet' | 'settings';

interface StoredAccount {
  name: string;
  createdAt: number;
}

interface TaskCardData {
  title: string;
  author: string;
  description: string;
  used: string;
  sponsor: string;
  earn: string;
}

interface TransactionData {
  title: string;
  date: string;
  amount: string;
  positive: boolean;
}

const ACCOUNT_STORAGE_KEY = 'kleo-sidepanel-account';
const kleoLogoPath = '../assets/images/kleoLogo.svg';
const kleoTokenPath = '../assets/images/KleoToken.svg';

const taskCards: TaskCardData[] = [
  {
    title: 'Amazon Buy Ps5',
    author: 'cyg123',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ullamco',
    used: '10.2K times',
    sponsor: 'Amazon',
    earn: '+5.5K',
  },
  {
    title: 'Amazon Buy Ps5',
    author: 'cyg123',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ullamco',
    used: '10.2K times',
    sponsor: 'Amazon',
    earn: '+5.5K',
  },
  {
    title: 'Amazon Buy Ps5',
    author: 'cyg123',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ullamco',
    used: '10.2K times',
    sponsor: 'Amazon',
    earn: '+5.5K',
  },
];

const transactions: TransactionData[] = [
  { title: 'Spent on Amazon buy Ps5', date: '06 Dec 2024', amount: '- 5 XP', positive: false },
  { title: 'Spent on Amazon buy Ps5', date: '06 Dec 2024', amount: '- 5 XP', positive: false },
  { title: 'Spent on Amazon buy Ps5', date: '06 Dec 2024', amount: '- 5 XP', positive: false },
  { title: 'Transferred from wallet', date: '06 Dec 2024', amount: '+ 142 XP', positive: true },
  { title: 'Completed Task successfully', date: '06 Dec 2024', amount: '+ 142 XP', positive: true },
  { title: 'Spent on Amazon buy Ps5', date: '06 Dec 2024', amount: '- 140 XP', positive: false },
];

const generalSettings = [
  { title: 'Lorem Ipsum dolor', subtitle: 'Lorem ipsum dolor sit amet', type: 'text' },
  { title: 'Lorem Ipsum dolor', subtitle: 'Lorem ipsum dolor sit amet', type: 'field' },
  { title: 'Lorem Ipsum dolor', subtitle: 'Lorem ipsum dolor sit amet', type: 'toggle-on' },
  { title: 'Lorem Ipsum dolor', subtitle: 'Lorem ipsum dolor sit amet', type: 'toggle-off' },
  { title: 'Lorem Ipsum dolor', subtitle: 'Lorem ipsum dolor sit amet', type: 'text' },
];

const advancedSettings = [
  { title: 'Lorem Ipsum dolor', subtitle: 'Lorem ipsum dolor sit amet', type: 'copy' },
  { title: 'Lorem Ipsum dolor', subtitle: 'Lorem ipsum dolor sit amet', type: 'text' },
  { title: 'Lorem Ipsum dolor', subtitle: 'Lorem ipsum dolor sit amet', type: 'text' },
];

function readStoredAccount(callback: (account: StoredAccount | null) => void) {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get([ACCOUNT_STORAGE_KEY, 'user'], (result) => {
      const savedAccount = result[ACCOUNT_STORAGE_KEY] as StoredAccount | undefined;
      const legacyUser = result.user as { name?: string; id?: string; address?: string } | undefined;

      if (savedAccount?.name) {
        callback(savedAccount);
        return;
      }

      if (legacyUser) {
        callback({
          name: legacyUser.name || legacyUser.id || legacyUser.address || 'Kleo User',
          createdAt: Date.now(),
        });
        return;
      }

      callback(null);
    });
    return;
  }

  const rawAccount = localStorage.getItem(ACCOUNT_STORAGE_KEY);
  callback(rawAccount ? JSON.parse(rawAccount) : null);
}

function saveStoredAccount(account: StoredAccount) {
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.set({ [ACCOUNT_STORAGE_KEY]: account });
    return;
  }

  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
}

function LogoHeader(): ReactElement {
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#D9DCE9] bg-white px-4">
      <div className="flex items-center gap-2">
        <img src={kleoLogoPath} alt="Kleo" className="h-6 w-6" />
        <span className="text-[16px] font-bold leading-none text-[#0D0F16]">KLEO</span>
      </div>
      <div className="flex h-9 items-center gap-2 rounded-lg bg-white px-3 shadow-[0_1px_10px_rgba(80,73,122,0.08)]">
        <img src={kleoTokenPath} alt="" className="h-7 w-7" />
        <span className="text-[15px] font-medium text-[#1F2433]">1784</span>
        <span className="text-[10px] font-medium uppercase text-[#8B94B2]">Kleo</span>
      </div>
    </header>
  );
}

function AccountScreen({ onAccountReady }: { onAccountReady: (name: string) => void }): ReactElement {
  const [name, setName] = useState('Alice Watson');
  const [privateKey, setPrivateKey] = useState('');

  const handleCreateAccount = (event: FormEvent) => {
    event.preventDefault();
    onAccountReady(name.trim() || 'Kleo User');
  };

  const handleImportAccount = (event: FormEvent) => {
    event.preventDefault();
    onAccountReady(name.trim() || 'Imported Account');
    setPrivateKey('');
  };

  return (
    <main className="flex h-full flex-col items-center bg-white px-6 pt-[70px] text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7F56D9]">
        <img src={kleoLogoPath} alt="" className="h-8 w-8" />
      </div>

      <h1 className="mt-6 text-[24px] font-bold leading-8 text-[#1D1E2A]">Create an Account</h1>
      <p className="mt-2 text-[13px] font-normal text-[#303341]">Enter your details to proceed further</p>

      <form onSubmit={handleCreateAccount} className="mt-7 flex w-full flex-col gap-6 text-left">
        <label className="relative flex h-[56px] flex-col justify-center rounded-lg bg-[#ECEEF7] px-4 pr-11">
          <span className="text-[13px] font-medium text-[#8E91A1]">Your Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 bg-transparent text-[14px] font-semibold leading-5 text-[#1D1E2A] outline-none"
            aria-label="Your name"
          />
          <UserIcon className="absolute right-4 top-5 h-4 w-4 text-[#1D1E2A]" />
        </label>

        <button
          type="submit"
          className="h-[54px] rounded-lg bg-[#8350DC] text-[16px] font-bold text-white shadow-[0_8px_18px_rgba(127,86,217,0.22)] transition-colors hover:bg-[#7243C6]"
        >
          Create New Account
        </button>
      </form>

      <div className="my-6 flex w-full items-center gap-4">
        <span className="h-px flex-1 bg-[#E7E8EF]" />
        <span className="text-[13px] font-medium text-[#8B84A6]">Or</span>
        <span className="h-px flex-1 bg-[#E7E8EF]" />
      </div>

      <form onSubmit={handleImportAccount} className="flex w-full flex-col text-left">
        <h2 className="text-[24px] font-bold leading-8 text-[#1D1E2A]">Import your Account</h2>
        <p className="mt-2 text-[13px] font-normal text-[#333640]">Already have an account? Import by using your private key</p>
        <label className="relative mt-5 flex h-[56px] flex-col justify-center rounded-lg bg-[#ECEEF7] px-4 pr-11">
          <span className="sr-only">Enter Private Key</span>
          <input
            value={privateKey}
            onChange={(event) => setPrivateKey(event.target.value)}
            placeholder="Enter Private Key"
            className="bg-transparent text-[14px] font-semibold leading-5 text-[#1D1E2A] placeholder:text-[#8E91A1] outline-none"
            aria-label="Private key"
          />
          <KeyIcon className="absolute right-4 top-5 h-4 w-4 text-[#1D1E2A]" />
        </label>
        <button
          type="submit"
          className="mt-5 h-[54px] rounded-lg bg-black text-[16px] font-bold text-white transition-colors hover:bg-[#171717]"
        >
          Import Account
        </button>
      </form>
    </main>
  );
}

function TasksScreen(): ReactElement {
  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[#EAECF5] px-5 pt-7">
      <h1 className="text-[22px] font-bold leading-7 text-black">Your Personal AI Assistant</h1>
      <p className="mt-3 text-[13px] font-medium leading-5 text-[#4D566B]">
        Select your task and sit back as your personal ai assistant take over.
      </p>
      <label className="mt-5 flex h-[44px] items-center gap-3 rounded-lg bg-[#DDE1F0] px-4">
        <SearchIcon className="h-5 w-5 text-black" />
        <input
          className="w-full bg-transparent text-[14px] font-medium text-[#1E2330] placeholder:text-[#1E2330] outline-none"
          placeholder="Search cards"
          aria-label="Search cards"
        />
      </label>

      <section className="mt-5 flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto pb-24 pr-1 scrollbar-thin">
        {taskCards.map((task, index) => (
          <TaskCard task={task} key={`${task.title}-${index}`} />
        ))}
      </section>
    </main>
  );
}

function TaskCard({ task }: { task: TaskCardData }): ReactElement {
  return (
    <article className="rounded-lg bg-white px-4 pb-4 pt-[14px] shadow-[0_1px_2px_rgba(49,50,75,0.02)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-md bg-[#EBEEF8] text-[24px] font-bold text-black">
            a
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-bold leading-6 text-black">{task.title}</h2>
            <p className="mt-2 text-[11px] font-medium text-[#343845]">Created by {task.author}</p>
          </div>
        </div>
        <div className="flex h-[24px] shrink-0 items-center gap-1 rounded-full bg-[#F3F4FA] px-3 text-[10px] font-medium text-[#222530]">
          <StarIcon className="h-3 w-3 text-[#F7A928]" />
          3.5 Rating
        </div>
      </div>

      <p className="mt-4 text-[13px] font-medium leading-5 text-[#2F3443]">{task.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <TaskChip icon={<UserIcon className="h-3 w-3 text-[#8054DD]" />} label="Used:" value={task.used} />
        <TaskChip icon={<span className="text-[12px] font-bold text-black">a</span>} label="Sponsored:" value={task.sponsor} />
        <TaskChip icon={<CoinIcon className="h-3 w-3 text-[#8054DD]" />} label="Earn:" value={task.earn} />
      </div>

      <button className="mt-4 flex h-[44px] w-full items-center justify-center gap-3 rounded-lg bg-[#8350DC] text-[17px] font-semibold text-white transition-colors hover:bg-[#7243C6]">
        <PlayIcon className="h-6 w-6" />
        Play Script
      </button>
    </article>
  );
}

function WalletScreen(): ReactElement {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#EAECF5] px-5 pb-24 pt-6 scrollbar-thin">
      <section className="rounded-lg bg-gradient-to-br from-[#4A2ED0] via-[#7F56D9] to-[#A778F8] px-5 py-6 text-white shadow-[0_12px_30px_rgba(84,51,187,0.22)]">
        <p className="text-center text-[14px] font-medium">Your balance is</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <img src={kleoTokenPath} alt="" className="h-[48px] w-[48px]" />
          <span className="text-[46px] font-bold leading-none tracking-[0]">1,454</span>
        </div>
        <p className="mt-2 text-center text-[20px] font-medium">XP Points</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <WalletStat label="Total Spent" value="1,546 XP" />
          <WalletStat label="Total Received" value="1564 XP" />
        </div>

        <button className="mt-6 h-[44px] w-full rounded-lg bg-white text-[16px] font-bold text-[#7351D8] transition-colors hover:bg-[#F6F4FF]">
          Withdraw Balance
        </button>
      </section>

      <section className="mt-7">
        <h1 className="text-[20px] font-bold leading-7 text-black">Previous Transactions</h1>
        <p className="mt-2 text-[13px] font-medium leading-5 text-[#333640]">
          Select your task and sit back as your personal ai assistant take over.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          {transactions.map((transaction, index) => (
            <TransactionItem transaction={transaction} key={`${transaction.title}-${index}`} />
          ))}
        </div>
      </section>
    </main>
  );
}

function WalletStat({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="flex h-[54px] items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3">
      <div className="flex h-9 w-9 items-center justify-center rounded bg-white/12">
        <SyncIcon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-white">{label}</p>
        <p className="mt-1 whitespace-nowrap text-[17px] font-bold leading-none text-white">{value}</p>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: TransactionData }): ReactElement {
  return (
    <article className="flex min-h-[64px] items-center justify-between rounded-lg bg-white px-4">
      <div>
        <h2 className="text-[17px] font-bold leading-6 text-black">{transaction.title}</h2>
        <p className="mt-1 text-[11px] font-medium text-[#333640]">{transaction.date}</p>
      </div>
      <span className={`text-[18px] font-bold ${transaction.positive ? 'text-[#09B66D]' : 'text-[#FF6B66]'}`}>
        {transaction.amount}
      </span>
    </article>
  );
}

function SettingsScreen(): ReactElement {
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#EAECF5] px-5 pb-24 pt-8 scrollbar-thin">
      <h1 className="text-[21px] font-bold leading-7 text-black">General Setting</h1>
      <section className="relative mt-5 rounded-lg bg-white px-4 py-2">
        <div className="pointer-events-none absolute left-1/2 top-[72px] flex h-[54px] w-[54px] -translate-x-1/2 items-center justify-center rounded-full bg-[#262626] shadow-[0_5px_10px_rgba(0,0,0,0.36)]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF4A23] text-[21px] font-medium text-white">V</span>
        </div>
        {generalSettings.map((setting, index) => (
          <SettingsRow setting={setting} isLast={index === generalSettings.length - 1} key={`${setting.title}-${index}`} />
        ))}
      </section>

      <h2 className="mt-6 text-[21px] font-bold leading-7 text-black">Advanced Settings</h2>
      <p className="mt-2 text-[13px] font-medium text-[#333640]">Adviced not to change these</p>
      <section className="mt-5 rounded-lg bg-white px-4 py-2">
        {advancedSettings.map((setting, index) => (
          <SettingsRow setting={setting} isLast={index === advancedSettings.length - 1} key={`${setting.title}-${index}`} />
        ))}
      </section>
    </main>
  );
}

function SettingsRow({
  setting,
  isLast,
}: {
  setting: { title: string; subtitle: string; type: string };
  isLast: boolean;
}): ReactElement {
  return (
    <div className={`flex min-h-[68px] items-center justify-between gap-4 ${isLast ? '' : 'border-b border-[#E4E5EB]'}`}>
      <div className="min-w-0 py-3">
        <h3 className="truncate text-[16px] font-bold leading-5 text-black">{setting.title}</h3>
        {setting.type === 'field' ? (
          <div className="mt-3 h-9 rounded-md bg-[#EAECF5] px-3 py-2 text-[12px] font-medium text-[#2F3443]">
            {setting.subtitle}
          </div>
        ) : (
          <p className="mt-2 text-[12px] font-medium leading-4 text-[#333640]">{setting.subtitle}</p>
        )}
      </div>

      {setting.type === 'toggle-on' && <Toggle enabled />}
      {setting.type === 'toggle-off' && <Toggle />}
      {setting.type === 'copy' && <CopyIcon className="h-5 w-5 shrink-0 text-[#46529A]" />}
    </div>
  );
}

function Toggle({ enabled = false }: { enabled?: boolean }): ReactElement {
  return (
    <span className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 ${enabled ? 'justify-end bg-[#8350DC]' : 'justify-start bg-[#F3F3F4]'}`}>
      <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
    </span>
  );
}

function BottomNav({ activeTab, onChange }: { activeTab: TabKey; onChange: (tab: TabKey) => void }): ReactElement {
  const items: Array<{ key: TabKey; label: string; icon: ReactElement }> = [
    { key: 'tasks', label: 'Tasks', icon: <TasksIcon className="h-5 w-5" /> },
    { key: 'wallet', label: 'Wallet', icon: <WalletIcon className="h-5 w-5" /> },
    { key: 'settings', label: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 grid h-[72px] grid-cols-3 gap-2 border-t border-[#ECEEF7] bg-white px-3 py-2">
      {items.map((item) => {
        const isActive = item.key === activeTab;
        return (
          <button
            type="button"
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg text-[12px] font-medium transition-colors ${
              isActive ? 'bg-[#ECEEF7] text-[#7546D8]' : 'text-[#58639A] hover:bg-[#F6F7FC]'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function TaskChip({ icon, label, value }: { icon: ReactElement; label: string; value: string }): ReactElement {
  return (
    <span className="flex h-[25px] items-center gap-1 rounded-full bg-[#F1F2FA] px-2 text-[10px] text-[#242938]">
      {icon}
      <span className="font-bold">{label}</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}

function SidePanel(): ReactElement {
  const [account, setAccount] = useState<StoredAccount | null>(null);
  const [isAccountLoaded, setIsAccountLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('tasks');

  useEffect(() => {
    readStoredAccount((storedAccount) => {
      setAccount(storedAccount);
      setIsAccountLoaded(true);
    });
  }, []);

  const handleAccountReady = (name: string) => {
    const nextAccount = { name, createdAt: Date.now() };
    saveStoredAccount(nextAccount);
    setAccount(nextAccount);
  };

  if (!isAccountLoaded) {
    return (
      <div className="flex h-[640px] w-[400px] items-center justify-center bg-[#EAECF5]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D9DCE9] border-t-[#8350DC]" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="h-[640px] w-[400px] overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_rgba(23,24,40,0.16)]">
        <AccountScreen onAccountReady={handleAccountReady} />
      </div>
    );
  }

  return (
    <div className="relative flex h-[640px] w-[400px] overflow-hidden rounded-xl bg-[#EAECF5] shadow-[0_20px_40px_rgba(23,24,40,0.16)]">
      <div className="flex min-h-0 w-full flex-col">
        <LogoHeader />
        {activeTab === 'tasks' && <TasksScreen />}
        {activeTab === 'wallet' && <WalletScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </div>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

function UserIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M15 10a4 4 0 1 1-1.17-2.83A4 4 0 0 1 15 10Z" stroke="currentColor" strokeWidth="2" />
      <path d="m14 14 2 2h2v2h2v2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.2 16.2 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="m12 2.4 2.9 5.9 6.5 1-4.7 4.5 1.1 6.4L12 17.2l-5.8 3 1.1-6.4-4.7-4.5 6.5-1L12 2.4Z" />
    </svg>
  );
}

function CoinIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v10M9 10.5c0-1.2 1.1-2 3-2s3 .8 3 2-1.1 2-3 2-3 .8-3 2 1.1 2 3 2 3-.8 3-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

function SyncIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 7.5A7 7 0 0 1 19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 4v3.5h3.5M17 16.5A7 7 0 0 1 5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 20v-3.5h-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TasksIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M16 12h4v4h-4a2 2 0 0 1 0-4Z" stroke="currentColor" strokeWidth="2" />
      <path d="M6 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" stroke="currentColor" strokeWidth="2" />
      <path d="m19 12 .9-2.1-2-3.4-2.3.3a7.2 7.2 0 0 0-1.8-1L12.8 3H9.2l-.9 2.8a7.2 7.2 0 0 0-1.8 1l-2.3-.3-2 3.4L3 12l-.9 2.1 2 3.4 2.3-.3a7.2 7.2 0 0 0 1.8 1l.9 2.8h3.6l.9-2.8a7.2 7.2 0 0 0 1.8-1l2.3.3 2-3.4L19 12Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="8" y="4" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M6 8H5a1.5 1.5 0 0 0-1.5 1.5V20A1.5 1.5 0 0 0 5 21.5h8.5A1.5 1.5 0 0 0 15 20v-1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default SidePanel;
