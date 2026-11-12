import type { JavaConcept, Pattern, JavaCollection, Difficulty } from '../types'

/** Difficulty quotas — the app tracks progress against these targets (50 + 100 + 20 = 170). */
export const DIFFICULTY_TARGETS: Record<Difficulty, number> = {
  Easy: 50,
  Medium: 100,
  Hard: 20,
}

export const TOTAL_TARGET = 170

/** Per-pattern targets used in the "Pattern Breakdown" chart. */
export const PATTERN_TARGETS: Record<Pattern, number> = {
  Arrays: 25,
  Strings: 18,
  HashMap: 16,
  'Two Pointers': 14,
  'Sliding Window': 10,
  'Binary Search': 12,
  Stack: 8,
  Queue: 5,
  LinkedList: 8,
  Trees: 20,
  BST: 10,
  Heaps: 10,
  Graphs: 18,
  DP: 20,
  Backtracking: 10,
  Greedy: 10,
  Intervals: 8,
  Trie: 6,
  'Bit Manipulation': 8,
  Math: 8,
  Sorting: 8,
  'Union Find': 8,
}

export const ALL_PATTERNS = Object.keys(PATTERN_TARGETS) as Pattern[]

export const ALL_COLLECTIONS: JavaCollection[] = [
  'ArrayList', 'LinkedList', 'HashMap', 'TreeMap', 'LinkedHashMap',
  'HashSet', 'TreeSet', 'LinkedHashSet', 'Stack', 'ArrayDeque',
  'PriorityQueue', 'Arrays', 'Collections', 'StringBuilder', 'String',
  'int[]', 'char[][]',
]

export const COLLECTION_GROUPS: { label: string; items: JavaCollection[] }[] = [
  { label: 'Lists', items: ['ArrayList', 'LinkedList'] },
  { label: 'Maps', items: ['HashMap', 'TreeMap', 'LinkedHashMap'] },
  { label: 'Sets', items: ['HashSet', 'TreeSet', 'LinkedHashSet'] },
  { label: 'Queues / Stack', items: ['Stack', 'ArrayDeque', 'PriorityQueue'] },
  { label: 'Utilities', items: ['Arrays', 'Collections', 'StringBuilder', 'String'] },
  { label: 'Raw arrays', items: ['int[]', 'char[][]'] },
]

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: '#00d4aa',
  Medium: '#ffa500',
  Hard: '#ff4757',
}

export const STATUS_COLORS: Record<string, string> = {
  Solved: '#00d4aa',
  Attempted: '#ffa500',
  'Need Revision': '#ff4757',
  not_started: '#64748b',
  in_progress: '#ffa500',
  completed: '#00d4aa',
}

/** Java concepts seeded on first launch — mirrors the study plan in the brief. */
export const SEED_CONCEPTS: Omit<JavaConcept, 'id'>[] = [
  // ---------- Fundamentals ----------
  { topic: 'Java Fundamentals', subtopic: 'Variables & Data Types (int, double, boolean, char, String)', category: 'fundamentals', status: 'completed', confidence: 5 },
  { topic: 'Java Fundamentals', subtopic: 'Operators (arithmetic, relational, logical, bitwise)', category: 'fundamentals', status: 'completed', confidence: 5 },
  { topic: 'Java Fundamentals', subtopic: 'Control Flow (if/else, switch, for, while, do-while)', category: 'fundamentals', status: 'completed', confidence: 5 },
  { topic: 'Java Fundamentals', subtopic: 'Arrays (1D, 2D, Arrays class methods)', category: 'fundamentals', status: 'completed', confidence: 4 },
  { topic: 'Java Fundamentals', subtopic: 'Strings (String, StringBuilder, StringBuffer)', category: 'fundamentals', status: 'completed', confidence: 4 },
  { topic: 'Java Fundamentals', subtopic: 'Methods (parameters, return types, overloading)', category: 'fundamentals', status: 'completed', confidence: 4 },
  { topic: 'OOP', subtopic: 'Classes & Objects', category: 'fundamentals', status: 'in_progress', confidence: 3 },
  { topic: 'OOP', subtopic: 'Inheritance & Polymorphism', category: 'fundamentals', status: 'not_started', confidence: 1 },
  { topic: 'OOP', subtopic: 'Abstraction & Interfaces', category: 'fundamentals', status: 'not_started', confidence: 1 },
  { topic: 'OOP', subtopic: 'Encapsulation', category: 'fundamentals', status: 'not_started', confidence: 1 },
  { topic: 'Java Fundamentals', subtopic: 'Exception Handling (try/catch/finally/throw/throws)', category: 'fundamentals', status: 'not_started', confidence: 1 },
  { topic: 'Java Fundamentals', subtopic: 'Generics (<T>, bounded types)', category: 'fundamentals', status: 'not_started', confidence: 1 },
  { topic: 'Java Fundamentals', subtopic: 'Comparable & Comparator', category: 'fundamentals', status: 'not_started', confidence: 1 },

  // ---------- Collections ----------
  { topic: 'Collections Framework', subtopic: 'ArrayList — add, remove, get, size, contains', category: 'collections', status: 'completed', confidence: 5 },
  { topic: 'Collections Framework', subtopic: 'HashMap — put, get, getOrDefault, containsKey, entrySet', category: 'collections', status: 'completed', confidence: 5 },
  { topic: 'Collections Framework', subtopic: 'HashSet — add, contains, remove', category: 'collections', status: 'completed', confidence: 4 },
  { topic: 'Collections Framework', subtopic: 'LinkedList — when to use over ArrayList', category: 'collections', status: 'not_started', confidence: 1 },
  { topic: 'Collections Framework', subtopic: 'TreeMap / TreeSet — sorted collections', category: 'collections', status: 'not_started', confidence: 1 },
  { topic: 'Collections Framework', subtopic: 'PriorityQueue — min-heap, max-heap with Comparator', category: 'collections', status: 'not_started', confidence: 2 },
  { topic: 'Collections Framework', subtopic: 'ArrayDeque — as Stack and Queue', category: 'collections', status: 'not_started', confidence: 1 },
  { topic: 'Collections Framework', subtopic: 'LinkedHashMap — insertion order', category: 'collections', status: 'not_started', confidence: 1 },
  { topic: 'Collections Framework', subtopic: 'Collections.sort() with custom Comparator', category: 'collections', status: 'not_started', confidence: 1 },
  { topic: 'Collections Framework', subtopic: 'Collections.reverseOrder(), Collections.frequency()', category: 'collections', status: 'not_started', confidence: 1 },

  // ---------- Java 8+ ----------
  { topic: 'Java 8+ Features', subtopic: 'Lambda Expressions ((a, b) -> a - b)', category: 'java8', status: 'not_started', confidence: 1 },
  { topic: 'Java 8+ Features', subtopic: 'Stream API (filter, map, collect, reduce)', category: 'java8', status: 'not_started', confidence: 1 },
  { topic: 'Java 8+ Features', subtopic: 'Optional class', category: 'java8', status: 'not_started', confidence: 1 },
  { topic: 'Java 8+ Features', subtopic: 'Method References (ClassName::methodName)', category: 'java8', status: 'not_started', confidence: 1 },
  { topic: 'Java 8+ Features', subtopic: 'Functional Interfaces', category: 'java8', status: 'not_started', confidence: 1 },
]

export const CONCEPT_CATEGORY_LABELS: Record<string, string> = {
  fundamentals: 'Java Fundamentals',
  collections: 'Collections Framework',
  java8: 'Java 8+ Features',
}

export interface Template {
  id: string
  title: string
  subtitle: string
  icon: string
  tags: string[]
  code: string
}

export const TEMPLATES: Template[] = [
  {
    id: 'hashmap',
    title: 'HashMap / Frequency Count',
    subtitle: 'The single most useful DSA snippet in Java',
    icon: '🗺️',
    tags: ['HashMap', 'Counting'],
    code: `// Frequency counting with getOrDefault
Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) {
    freq.put(x, freq.getOrDefault(x, 0) + 1);
}

// Iterate entries
for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
    int key = e.getKey(), count = e.getValue();
}

// Grouping: build a map of lists
Map<String, List<Integer>> groups = new HashMap<>();
groups.computeIfAbsent(word, k -> new ArrayList<>()).add(i);

// merge() is the elegant increment
freq.merge(x, 1, Integer::sum);`,
  },
  {
    id: 'priorityqueue',
    title: 'PriorityQueue (Min / Max Heap)',
    subtitle: 'Heaps for top-K, merge-K, Dijkstra',
    icon: '⛰️',
    tags: ['PriorityQueue', 'Heap'],
    code: `// Min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap =
    new PriorityQueue<>(Collections.reverseOrder());

// Heap of int[] ordered by first element
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);

// Heap of custom objects
PriorityQueue<int[]> byEnd = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));

// K largest elements
PriorityQueue<Integer> topK = new PriorityQueue<>(); // min-heap of size k
for (int x : nums) {
    topK.offer(x);
    if (topK.size() > k) topK.poll();
}
// topK now holds the k largest`,
  },
  {
    id: 'bfs',
    title: 'BFS (Grid + Graph)',
    subtitle: 'Shortest path in unweighted graphs',
    icon: '🌊',
    tags: ['Queue', 'ArrayDeque', 'Graphs'],
    code: `// Grid BFS — number of islands / rotting oranges
int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
Queue<int[]> q = new ArrayDeque<>();
q.offer(new int[]{sr, sc});
boolean[][] seen = new boolean[m][n];
seen[sr][sc] = true;
int steps = 0;

while (!q.isEmpty()) {
    int size = q.size();
    for (int i = 0; i < size; i++) {
        int[] cur = q.poll();
        for (int[] d : dirs) {
            int nr = cur[0] + d[0], nc = cur[1] + d[1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            if (seen[nr][nc] || grid[nr][nc] == 1) continue;
            seen[nr][nc] = true;
            q.offer(new int[]{nr, nc});
        }
    }
    steps++;
}

// Graph BFS (adjacency list)
Queue<Integer> queue = new ArrayDeque<>();
boolean[] visited = new boolean[n];
queue.offer(start); visited[start] = true;
while (!queue.isEmpty()) {
    int node = queue.poll();
    for (int next : adj.get(node)) {
        if (!visited[next]) { visited[next] = true; queue.offer(next); }
    }
}`,
  },
  {
    id: 'dfs',
    title: 'DFS (Recursive)',
    subtitle: 'Grid flood-fill, trees, connected components',
    icon: '🕳️',
    tags: ['Recursion', 'Graphs', 'Trees'],
    code: `// Grid DFS
void dfs(int[][] grid, int r, int c, boolean[][] seen) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
    if (seen[r][c] || grid[r][c] == 0) return;
    seen[r][c] = true;

    dfs(grid, r + 1, c, seen);
    dfs(grid, r - 1, c, seen);
    dfs(grid, r, c + 1, seen);
    dfs(grid, r, c - 1, seen);
}

// Tree DFS
int depth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(depth(root.left), depth(root.right));
}

// Iterative DFS with stack
Deque<Integer> stack = new ArrayDeque<>();
stack.push(start);
while (!stack.isEmpty()) {
    int node = stack.pop();
    if (visited[node]) continue;
    visited[node] = true;
    for (int next : adj.get(node)) stack.push(next);
}`,
  },
  {
    id: 'binarysearch',
    title: 'Binary Search',
    subtitle: 'Lower bound, upper bound, answer search',
    icon: '🎯',
    tags: ['Binary Search'],
    code: `// Classic exact search
int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;

// Lower bound: first index with arr[i] >= target
int lowerBound(int[] arr, int target) {
    int lo = 0, hi = arr.length; // hi is exclusive
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// Binary search on the answer
int lo = 1, hi = maxPossible;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid;
    else lo = mid + 1;
}
return lo;`,
  },
  {
    id: 'unionfind',
    title: 'Union Find (DSU)',
    subtitle: 'Path compression + union by rank',
    icon: '🔗',
    tags: ['Union Find', 'Graphs'],
    code: `class UnionFind {
    int[] parent, rank;
    int components;

    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        components = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]); // path compression
        return parent[x];
    }

    boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        components--;
        return true;
    }

    boolean connected(int a, int b) { return find(a) == find(b); }
}`,
  },
  {
    id: 'backtracking',
    title: 'Backtracking',
    subtitle: 'Subsets, permutations, combinations, N-Queens',
    icon: '🌳',
    tags: ['Backtracking', 'Recursion'],
    code: `void backtrack(int[] nums, int start,
                List<Integer> curr, List<List<Integer>> res) {
    res.add(new ArrayList<>(curr)); // snapshot — always copy!
    for (int i = start; i < nums.length; i++) {
        curr.add(nums[i]);
        backtrack(nums, i + 1, curr, res);
        curr.remove(curr.size() - 1); // undo
    }
}

// Permutations with a used[] array
void permute(int[] nums, boolean[] used, List<Integer> curr, List<List<Integer>> res) {
    if (curr.size() == nums.length) { res.add(new ArrayList<>(curr)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        curr.add(nums[i]);
        permute(nums, used, curr, res);
        curr.remove(curr.size() - 1);
        used[i] = false;
    }
}

// Prune duplicates after sorting
if (i > start && nums[i] == nums[i - 1]) continue;`,
  },
  {
    id: 'slidingwindow',
    title: 'Sliding Window',
    subtitle: 'Fixed and variable-size windows',
    icon: '🪟',
    tags: ['Sliding Window', 'Two Pointers'],
    code: `// Variable window — longest substring without repeats
int left = 0, maxLen = 0;
Map<Character, Integer> lastSeen = new HashMap<>();
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    if (lastSeen.containsKey(c)) {
        left = Math.max(left, lastSeen.get(c) + 1);
    }
    lastSeen.put(c, right);
    maxLen = Math.max(maxLen, right - left + 1);
}

// Fixed window of size k
int sum = 0, best = Integer.MIN_VALUE;
for (int i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (i >= k) sum -= nums[i - k];
    if (i >= k - 1) best = Math.max(best, sum);
}

// Variable window that must stay valid (shrink while invalid)
while (right < n) {
    // expand: add nums[right]
    while (invalid()) { /* shrink: remove nums[left]; */ left++; }
    right++;
}`,
  },
  {
    id: 'graphbuild',
    title: 'Build a Graph (Adjacency List)',
    subtitle: 'Undirected, directed, weighted, topological sort',
    icon: '🕸️',
    tags: ['Graphs', 'ArrayList'],
    code: `// Adjacency list
int n = 6;
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    adj.get(e[1]).add(e[0]); // drop this for directed
}

// Weighted: {node, weight}
List<List<int[]>> wadj = new ArrayList<>();
for (int i = 0; i < n; i++) wadj.add(new ArrayList<>());
wadj.get(u).add(new int[]{v, w});

// Topological sort (Kahn's algorithm)
int[] indeg = new int[n];
for (int u = 0; u < n; u++)
    for (int v : adj.get(u)) indeg[v]++;
Queue<Integer> q = new ArrayDeque<>();
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);
List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
    int u = q.poll();
    order.add(u);
    for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
}
if (order.size() != n) { /* cycle detected */ }`,
  },
  {
    id: 'twopointers',
    title: 'Two Pointers & Sorting',
    subtitle: 'Pair sums, dedupe, in-place removal',
    icon: '👉',
    tags: ['Two Pointers', 'Sorting'],
    code: `// Two-sum on a sorted array
int i = 0, j = nums.length - 1;
while (i < j) {
    int sum = nums[i] + nums[j];
    if (sum == target) return new int[]{i, j};
    if (sum < target) i++;
    else j--;
}

// Sort array / list of int[] by second element, then first
Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
list.sort(Comparator.comparingInt(a -> a[0]));

// Sort strings by length then lexicographic
Arrays.sort(words, Comparator.comparingInt(String::length).thenComparing(s -> s));

// Remove duplicates in place
int k = 0;
for (int x : nums) if (k == 0 || nums[k - 1] != x) nums[k++] = x;`,
  },
  {
    id: 'dp',
    title: 'Dynamic Programming Skeleton',
    subtitle: '1D, 2D, and memoization patterns',
    icon: '🧮',
    tags: ['DP', 'Memoization'],
    code: `// Bottom-up 1D (coin change)
int[] dp = new int[amount + 1];
Arrays.fill(dp, amount + 1);
dp[0] = 0;
for (int coin : coins)
    for (int a = coin; a <= amount; a++)
        dp[a] = Math.min(dp[a], dp[a - coin] + 1);
return dp[amount] > amount ? -1 : dp[amount];

// Bottom-up 2D (edit distance)
int[][] dp = new int[m + 1][n + 1];
for (int i = 1; i <= m; i++) dp[i][0] = i;
for (int j = 1; j <= n; j++) dp[0][j] = j;
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        dp[i][j] = s1.charAt(i - 1) == s2.charAt(j - 1)
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));

// Top-down memo
Integer[] memo = new Integer[n + 1];
int solve(int i) {
    if (i <= 1) return i;
    if (memo[i] != null) return memo[i];
    return memo[i] = solve(i - 1) + solve(i - 2);
}`,
  },
  {
    id: 'trie',
    title: 'Trie (Prefix Tree)',
    subtitle: 'Word search, autocomplete, prefix counts',
    icon: '🔤',
    tags: ['Trie', 'HashMap'],
    code: `class Trie {
    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        boolean isWord;
    }

    private final Node root = new Node();

    void insert(String word) {
        Node cur = root;
        for (char c : word.toCharArray())
            cur = cur.children.computeIfAbsent(c, k -> new Node());
        cur.isWord = true;
    }

    boolean search(String word) {
        Node cur = walk(word);
        return cur != null && cur.isWord;
    }

    boolean startsWith(String prefix) { return walk(prefix) != null; }

    private Node walk(String s) {
        Node cur = root;
        for (char c : s.toCharArray()) {
            cur = cur.children.get(c);
            if (cur == null) return null;
        }
        return cur;
    }
}`,
  },
  {
    id: 'tree',
    title: 'Binary Tree Traversals',
    subtitle: 'Inorder, level order, BST validation',
    icon: '🌲',
    tags: ['Trees', 'Queue'],
    code: `// Inorder (BST -> sorted)
void inorder(TreeNode node, List<Integer> out) {
    if (node == null) return;
    inorder(node.left, out);
    out.add(node.val);
    inorder(node.right, out);
}

// Level order / BFS
List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new ArrayDeque<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode cur = q.poll();
            level.add(cur.val);
            if (cur.left != null) q.offer(cur.left);
            if (cur.right != null) q.offer(cur.right);
        }
        res.add(level);
    }
    return res;
}

// Validate BST with allowed range
boolean valid(TreeNode node, long lo, long hi) {
    if (node == null) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return valid(node.left, lo, node.val) && valid(node.right, node.val, hi);
}`,
  },
]

export const JAVA_FACTS: string[] = [
  "HashMap buckets turn into red-black trees once a bucket holds 8+ entries (Java 8+), so worst-case lookup drops from O(n) to O(log n).",
  "String literals live in the string pool. `new String(\"hi\")` creates a fresh object — that is why `==` is a trap and `equals()` is the rule.",
  "`ArrayList` grows by 1.5× (oldCapacity + (oldCapacity >> 1)). Pre-size it with `new ArrayList<>(n)` when you already know the count.",
  "`ArrayDeque` is faster than `Stack` and `LinkedList` for both stack and queue use — it is the recommended default in modern Java.",
  "`HashMap` allows one null key and many null values; `Hashtable` allows neither. Use `containsKey()` before `get()` when null is a valid value.",
  "`PriorityQueue` is a min-heap by default. `Collections.reverseOrder()` or `(a, b) -> b - a` flips it — remember `b - a` can overflow ints.",
  "`TreeMap` and `TreeSet` keep elements sorted in O(log n) using red-black trees. Perfect for `floorKey` / `ceilingKey` queries.",
  "`StringBuilder` is not thread-safe but much faster than `String` concatenation inside loops; `StringBuffer` is the synchronized version.",
  "`Arrays.asList(1, 2, 3)` returns a fixed-size list — `add()` throws. Wrap it: `new ArrayList<>(Arrays.asList(...))`.",
  "`Collections.frequency(list, x)` and `Collections.sort(list, cmp)` save a lot of typing in easy/medium problems.",
  "`int[]` and `Integer[]` are not interchangeable. `Arrays.sort` works on both but `Collections.reverse` only on lists.",
  "`Math.floorMod(a, b)` returns a non-negative result for negative `a` — safer than `%` in hashing and circular index problems.",
  "An interface can have `default` methods since Java 8, which is why `Comparator.comparing(...).thenComparing(...)` chains so nicely.",
  "`Optional` is designed for return types, not fields. `orElseGet` is lazy; `orElse` always evaluates its argument.",
  "Streams are lazy: nothing runs until a terminal operation such as `collect`, `count`, or `forEach`.",
  "Boxed `Integer` caching only covers -128..127. Comparing two cached Integers with `==` may work — and then silently break.",
  "`switch` on enums is compile-time checked and faster than if-else chains for enum dispatch.",
  "A `record` (Java 16+) gives you equals/hashCode/toString for free — great for graph nodes and coordinate pairs.",
  "Recursion depth is limited by the thread stack (~5k–10k frames). Deep grid DFS on a 10^3 × 10^3 grid should be iterative.",
  "`Arrays.fill(dp, -1)` is the fastest way to initialise a primitive DP table — far quicker than a Stream.",
]
