export function throttle(func, delay = 0, options = {}) {
  let trailingTimeoutId = null;
  let leadingTimeoutId = null;
  let lastExecTime = 0;
  let leadingExec = true;
  let latestContext = null;
  let latestArgs = null;

  const { leading = true, trailing = true } = options;

  const armLeadingReset = (waitMs) => {
    clearTimeout(leadingTimeoutId);
    leadingTimeoutId = setTimeout(() => {
      leadingExec = true;
      leadingTimeoutId = null;
    }, Math.max(0, waitMs));
  };

  const execute = () => {
    const callContext = latestContext;
    const callArgs = latestArgs;
    latestContext = null;
    latestArgs = null;
    try {
      func.apply(callContext, callArgs);
    } finally {
      lastExecTime = Date.now();
    }
  };

  const throttledFunction = function throttled(...args) {
    latestContext = this;
    latestArgs = args;
    const now = Date.now();
    const elapsed = lastExecTime === 0 ? 0 : now - lastExecTime;

    if (leadingExec && leading) {
      clearTimeout(trailingTimeoutId);
      trailingTimeoutId = null;
      leadingExec = false;
      const nextExecDelay = elapsed < delay ? delay - elapsed : delay;
      try {
        execute();
      } finally {
        armLeadingReset(nextExecDelay);
      }
    } else if (!trailingTimeoutId && trailing) {
      clearTimeout(leadingTimeoutId);
      leadingTimeoutId = null;
      const remaining = lastExecTime === 0 ? delay : delay - elapsed;
      trailingTimeoutId = setTimeout(() => {
        trailingTimeoutId = null;
        leadingExec = false;
        try {
          execute();
        } finally {
          armLeadingReset(delay);
        }
      }, Math.max(0, remaining));
    }
  };

  // Cancel any pending scheduled executions and reset state for subsequent calls
  throttledFunction.cancel = () => {
    clearTimeout(trailingTimeoutId);
    trailingTimeoutId = null;
    clearTimeout(leadingTimeoutId);
    leadingTimeoutId = null;
    latestContext = null;
    latestArgs = null;
    leadingExec = true;
  };

  return throttledFunction;
}

export default throttle;
