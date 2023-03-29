export function getAssigneeId(mention) {
    mention = mention ? mention.toLowerCase() : '';
    const assigneeMap = new Map([
      ['Riya Sharma', 's.riya@flick2know.com'],
      ['samvit', 'samvit@flick2know.com'],
      ['param', '34377429456964'],
      ['animesh', '1202904304336852'],
      ['aditya', '1201392479885593'],
      ['chitransh', '415063412948698'],
      ['sayantani', '1201373923823953'],
      ['varun', 'varun@flick2know.com'],
    ]);
  
    for (const userName of assigneeMap.keys()) {
        if (userName.includes(mention)) {
          return assigneeMap.get(userName);
        }
    }
    return '0';
}
  