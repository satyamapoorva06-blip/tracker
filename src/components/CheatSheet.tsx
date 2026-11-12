import { useState } from 'react'
import { BookMarked, Copy, Check, Code2 } from 'lucide-react'
import { Sheet } from './ui/Primitives'
import { TEMPLATES, type Template } from '../data/seed'

const SNIPPETS: Template[] = [
  ...TEMPLATES,
  {
    id: 'syntax',
    title: 'Core Java syntax',
    subtitle: 'Variables, loops, methods, classes',
    icon: '🧱',
    tags: ['Basics'],
    code: `// Variables
int n = 10; long big = 10L; double d = 3.5; boolean ok = true;
char c = 'a'; String s = "java";
final int MAX = 100;           // constant (convention: UPPER_SNAKE)

// Arrays
int[] arr = new int[5];
int[] init = {1, 2, 3};
int[][] grid = new int[rows][cols];
Arrays.sort(arr);              // ascending
Arrays.fill(arr, -1);

// Loops
for (int i = 0; i < n; i++) { }
for (int x : arr) { }
while (n-- > 0) { }
do { } while (false);

// Methods
static int add(int a, int b) { return a + b; }
static void swap(int[] a, int i, int j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
}

// Classes
class Node {
    int val; Node next;
    Node(int val) { this.val = val; }
}`,
  },
  {
    id: 'collections-cheat',
    title: 'Collections cheat sheet',
    subtitle: 'Every method you actually use in interviews',
    icon: '📦',
    tags: ['ArrayList', 'HashMap', 'Set'],
    code: `// List
List<Integer> list = new ArrayList<>();
list.add(5); list.add(0, 2); list.get(0); list.size();
list.contains(5); list.remove(Integer.valueOf(5)); // by value
list.remove(0);                                   // by index
Collections.sort(list);
Collections.reverse(list);

// Map — counts, grouping, lookups
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.getOrDefault("a", 0);
map.containsKey("a"); map.remove("a");
for (Map.Entry<String, Integer> e : map.entrySet()) {
    e.getKey(); e.getValue();
}
map.computeIfAbsent("k", k -> new ArrayList<>()).add(1);

// Set
Set<Integer> set = new HashSet<>();
set.add(1); set.contains(1); set.remove(1); set.size();

// Stack / Queue
Deque<Integer> st = new ArrayDeque<>();
st.push(1); st.pop(); st.peek();
Deque<Integer> q = new ArrayDeque<>();
q.offer(1); q.poll(); q.peek();

// Heap
PriorityQueue<Integer> min = new PriorityQueue<>();
PriorityQueue<Integer> max = new PriorityQueue<>(Collections.reverseOrder());
min.offer(3); min.peek(); min.poll();`,
  },
]

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      className="btn-ghost h-9 min-h-0 px-2.5 text-[11px]"
      onClick={async (e) => {
        e.stopPropagation()
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          const ta = document.createElement('textarea')
          ta.value = text
          document.body.appendChild(ta)
          ta.select()
          document.execCommand('copy')
          ta.remove()
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check size={13} className="text-accent" /> : <Copy size={13} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function JavaCheatSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const filtered = SNIPPETS.filter(
    (t) =>
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.tags.join(' ').toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <Sheet open={open} onClose={onClose} title="Java quick reference">
      <input
        className="field mb-3"
        placeholder="Search templates — hashmap, bfs, binary search…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="space-y-2.5">
        {filtered.map((t) => (
          <details key={t.id} className="group rounded-2xl border border-white/[0.06] bg-white/[0.03]">
            <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3.5 py-3">
              <span className="text-base">{t.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold">{t.title}</p>
                <p className="truncate text-[10.5px] text-muted">{t.subtitle}</p>
              </div>
              <span className="text-[10px] font-semibold text-muted group-open:hidden">expand</span>
            </summary>
            <div className="px-3.5 pb-3.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {t.tags.map((tag) => (
                    <span key={tag} className="chip bg-white/[0.06] text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                <CopyBtn text={t.code} />
              </div>
              <pre className="code-block">{t.code}</pre>
            </div>
          </details>
        ))}
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-[10.5px] text-muted/70">
        <Code2 size={11} /> {SNIPPETS.length} copy-paste templates · works offline
      </p>
    </Sheet>
  )
}

/**
 * Floating trigger used on every screen. `compact` renders a small header
 * button instead of the docked pill.
 */
export default function CheatSheetButton({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {compact ? (
        <button
          onClick={() => setOpen(true)}
          className="icon-btn"
          aria-label="Java quick reference"
        >
          <BookMarked size={16} />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="btn-ghost flex-1 text-[12.5px]"
        >
          <BookMarked size={14} /> Cheat sheet
        </button>
      )}
      <JavaCheatSheet open={open} onClose={() => setOpen(false)} />
    </>
  )
}
