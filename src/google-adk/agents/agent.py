import asyncio
from contextlib import AsyncExitStack
from dotenv import load_dotenv
from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, SseServerParams
import logging 
from google.adk.tools import google_search,agent_tool
import os
import nest_asyncio # Import nest_asyncio


# Load environment variables from .env file in the parent directory
# Place this near the top, before using env vars like API keys
load_dotenv()
MCP_SERVER_URL=os.environ.get("MCP_SERVER_URL", "http://0.0.0.0:8080/sse")

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)
 
# --- Global variables ---
# Define them first, initialize as None
root_agent: LlmAgent | None = None
exit_stack: AsyncExitStack | None = None


async def get_tools_async():
  print("Attempting to connect to MCP Filesystem server...")
  tools, exit_stack = await MCPToolset.from_server(
      connection_params=SseServerParams(url=MCP_SERVER_URL, headers={})
  )
  log.info("MCP Toolset created successfully.")
  print("MCP Toolset created successfully.", tools)

  return tools, exit_stack
 

async def get_agent_async():
  """
  Asynchronously creates the MCP Toolset and the LlmAgent.

  Returns:
      tuple: (LlmAgent instance, AsyncExitStack instance for cleanup)
  """
  all_tools, exit_stack = await get_tools_async()

  search_agent = LlmAgent(
    model='gemini-2.0-flash',
    name='search_agent',
    description=(
        "perform google search."
    ),
    instruction="""
      You are a helpful agent tasked to perform searc operations on web.
        1. Receive `query` string.
        2. Use get_search_results(query) to fetch web snippets and sources.
        3. Return a Markdown response with sources.
    """,
    tools=[google_search],
    )

  root_agent = LlmAgent(
      model='gemini-2.0-flash', # Adjust model name if needed based on availability
      name='grid_sense',
      instruction="""
        You are a friendly and efficient assistant called gird_sense, an agentic on‑demand marketplace for energy transactions.
        Your primary goal is to help users discover, build, and automate flexible load adjustments in response to dynamic grid signals.

        **Meter Reading Queries:**
        1. Detect & Invoke
            - Recognize any request for meter details or readings.
            - Call the get_meters_by_id tool, passing the user’s meter ID(s) exactly as given.
        2. Format Response
            - Receive the tool’s JSON array of meter objects.
            - Return only a Markdown table. Use the JSON keys as the table’s column headers. Populate each row with the corresponding values for each meter.
            - Make sure you display the results to the user, always

      **Get Meter history:**
        1. Detect & Invoke
            - Recognize any request for meter details or readings history.
            - Call the get_meters_by_istory tool, passing the user’s meter ID(s) exactly as given.
        2. Format Response
            - Receive the tool’s JSON array of meter objects.
            - Return only a Markdown table. Use the JSON keys as the table’s column headers. Populate each row with the corresponding values for each meter.
            - Make sure you display the results to the user, always

      **Get all Meter readings:**
        1. Detect & Invoke
            - Recognize any request for geting all meter readings
            - Call the get_meters_by_readings tool, passing the ID exactly as given.
        2. Format Response
            - Receive the tool’s JSON array of meter objects.
            - Return only a Markdown table. Use the JSON keys as the table’s column headers. Populate each row with the corresponding values for each meter.
            - Make sure you display the results to the user, always

        **Search Queries:**
        1. Detect & Invoke
            - Invoke search_agent, passing the user query
        2. Format Response
            - Receive the search results from the search_agent.
            - Return a JSON list of {title, snippet, url}.        
    
        General Guidelines for all other queries:
        - If the question is not about meter readings, do not call get_meters_by_id.
        - Provide concise, accurate answers drawing on your domain expertise:
      """,
       tools = [agent_tool.AgentTool(agent=search_agent)] + [tool for tool in all_tools],
       #tools=tools,
  )
  print("LlmAgent created.")

  # Return both the agent and the exit_stack needed for cleanup
  return root_agent, exit_stack


async def initialize():
   """Initializes the global root_agent and exit_stack."""
   global root_agent, exit_stack
   print("Initializing agent...", root_agent)
   if root_agent is None:
       log.info("Initializing agent...")
       root_agent, exit_stack = await get_agent_async()
       if root_agent:
           log.info("Agent initialized successfully.")
       else:
           log.error("Agent initialization failed.")
       
   else:
       log.info("Agent already initialized.")

def _cleanup_sync():
    """Synchronous wrapper to attempt async cleanup."""
    if exit_stack:
        log.info("Attempting to close MCP connection via atexit...")
        try:
            asyncio.run(exit_stack.aclose())
            log.info("MCP connection closed via atexit.")
        except Exception as e:
            log.error(f"Error during atexit cleanup: {e}", exc_info=True)


nest_asyncio.apply()

log.info("Running agent initialization at module level using asyncio.run()...")
try:
    asyncio.run(initialize())
    log.info("Module level asyncio.run(initialize()) completed.")
except RuntimeError as e:
    log.error(f"RuntimeError during module level initialization (likely nested loops): {e}", exc_info=True)
except Exception as e:
    log.error(f"Unexpected error during module level initialization: {e}", exc_info=True)
