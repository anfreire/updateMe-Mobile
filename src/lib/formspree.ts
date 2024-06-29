export namespace FormSpree {
  const forms = {
    reports: 'https://formspree.io/f/xpzvkgvr',
    suggestions: 'https://formspree.io/f/xkndkldz',
  };

  type formType = keyof typeof forms;

  export async function submitForm(
    form: formType,
    data: Record<string, string>,
  ): Promise<boolean> {
    const res = await fetch(forms[form], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  }
}
